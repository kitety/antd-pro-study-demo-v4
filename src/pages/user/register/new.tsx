import { connect } from 'dva';
import uuidv4 from 'uuid/v4'
import { Dispatch } from 'redux';
import React, { useState, FC } from 'react';
import { Form, Input, Tooltip, Row, Col, Button, message } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import styles from './style.less';

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};
interface RegisterProps {
  dispatch: Dispatch<any>;
  userAndregister: StateType;
  submitting: boolean;
}
export interface UserRegisterParams {
  user: {
    email: string;
    password: string;
    username: string;
    password_confirmation: string;
    phone: string;
    code: string;
  };
}
export interface captchaParams {
  phone: string;
}

const RegistrationForm: FC<RegisterProps> = props => {
  const { submitting, userAndregister, dispatch } = props;
  const { errors } = userAndregister;
  const [form] = Form.useForm();
  const { getFieldValue } = form;
  const [count, setcount]: [number, any] = useState(0);
  const [imgUrl, setImgUrl]: [string, any] = useState('http://staging.qiuzhi99.com/rucaptcha');
  let interval: number | undefined;
  const reloadImg = () => {
    const randomStr = uuidv4()
    setImgUrl(`http://staging.qiuzhi99.com/rucaptcha?a=${randomStr}`);
  };

  const onGetCaptcha = () => {
    const phone = getFieldValue('phone');
    if (!phone?.trim()) {
      return message.error('请输入手机号');
    }
    let counts = 59;
    setcount(counts);
    interval = window.setInterval(() => {
      counts -= 1;
      setcount(counts);

      if (counts === 0) {
        clearInterval(interval);
      }
    }, 1000);
    dispatch({
      type: 'userAndregister/getCaptcha',
      payload: { mobile: phone },
    });
  };
  const onFinish = (values: { [key: string]: any }) => {
    dispatch({
      type: 'userAndregister/submit',
      payload: { user: { ...values } },
    });
  };

  return (
    <div className={styles.main1}>
      <Form {...formItemLayout} form={form} name="register" onFinish={onFinish} scrollToFirstError>
        <Form.Item
          name="username"
          validateStatus={errors?.username ? 'error' : ''}
          help={errors?.username ?? ''}
          label={
            <span>
              Username&nbsp;
              <Tooltip title="What do you want others to call you?">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
          rules={[
            {
              required: true,
              message: 'Please input your nickname!',
              whitespace: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="E-mail"
          validateStatus={errors?.email ? 'error' : ''}
          help={errors?.email ?? ''}
          rules={[
            {
              type: 'email',
              message: 'The input is not valid E-mail!',
            },
            {
              required: true,
              message: 'Please input your E-mail!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          validateStatus={errors?.password ? 'error' : ''}
          help={errors?.password ?? ''}
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="password_confirmation"
          label="Confirm Password"
          dependencies={['password']}
          validateStatus={errors?.password_confirmation ? 'error' : ''}
          help={errors?.password_confirmation ?? ''}
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Please confirm your password!',
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }

                return Promise.reject('The two passwords that you entered do not match!');
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Phone Number"
          validateStatus={errors?.phone ? 'error' : ''}
          help={errors?.phone ?? ''}
          rules={[
            {
              required: true,
              message: 'Please input your phone number!',
            },
          ]}
        >
          <Input
            style={{
              width: '100%',
            }}
          />
        </Form.Item>

        <Form.Item label="Captcha" extra="We must make sure that your are a human.">
          <Row gutter={8}>
            <Col span={12}>
              <Form.Item
                name="code"
                noStyle
                validateStatus={errors?.code ? 'error' : ''}
                help={errors?.code ?? ''}
                rules={[
                  {
                    required: true,
                    message: 'Please input the captcha you got!',
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Button disabled={!!count} onClick={onGetCaptcha}>
                {count ? `${count} s` : '获取验证码'}
              </Button>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item label="图形验证码" extra="We must make sure that your are a human.">
          <Row gutter={8}>
            <Col span={12}>
              <Form.Item
                name="_rucaptcha"
                noStyle
                validateStatus={errors?.rucaptcha ? 'error' : ''}
                help={errors?.rucaptcha ?? ''}
                rules={[
                  {
                    required: true,
                    message: 'Please input the captcha you got!',
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <img src={imgUrl} alt="" srcSet="" onClick={reloadImg} />
            </Col>
          </Row>
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" loading={submitting}>
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export interface StateType {
  status?: 'ok' | 'error';
  errors?: { [key: string]: string };
  currentAuthority?: 'user' | 'guest' | 'admin';
}
export default connect(
  ({
    userAndregister,
    loading,
  }: {
    userAndregister: StateType;
    loading: {
      effects: {
        [key: string]: boolean;
      };
    };
  }) => ({
    userAndregister,
    submitting: loading.effects['userAndregister/submit'],
  }),
)(RegistrationForm);
