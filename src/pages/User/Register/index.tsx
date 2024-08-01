import { Footer } from '@/components';
import {
  LoginForm,
} from '@ant-design/pro-components';
import { history, useModel, Helmet } from '@umijs/max';
import { Alert, Form, message, Tabs } from 'antd';
import Settings from '../../../../config/defaultSettings';
import React, {useEffect, useState} from 'react';
import { createStyles } from 'antd-style';
import {getLoginUserUsingGet, userLoginUsingPost, userRegisterUsingPost} from "@/services/songgt_BI/userController";
import { Input } from 'antd/lib';
import {Link} from "@@/exports";
const useStyles = createStyles(({ token }) => {
  return {
    action: {
      marginLeft: '8px',
      color: 'rgba(0, 0, 0, 0.2)',
      fontSize: '24px',
      verticalAlign: 'middle',
      cursor: 'pointer',
      transition: 'color 0.3s',
      '&:hover': {
        color: token.colorPrimaryActive,
      },
    },
    lang: {
      width: 42,
      height: 42,
      lineHeight: '42px',
      position: 'fixed',
      right: 16,
      borderRadius: token.borderRadius,
      ':hover': {
        backgroundColor: token.colorBgTextHover,
      },
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    },
  };
});

const Register: React.FC = () => {
  const [type, setType] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');
  const { styles } = useStyles();

  const handleSubmit = async (values: API.UserRegisterRequest) => {
    try {
      // 注册
      const res = await userRegisterUsingPost(values);
      if (res.code === 0) {
        const defaultRegisterSuccessMessage = '注册成功！';
        message.success(defaultRegisterSuccessMessage);
        history.push('/user/login');
      }else{
        message.error(res.message);
      }
    } catch (error) {
      const defaultRegisterFailureMessage = '注册失败，请重试！';
      console.log(error);
      message.error(defaultRegisterFailureMessage);
    }
  };
  return (
    <div className={styles.container}>
      <Helmet>
        <title>
          {' '}- {Settings.title}
        </title>
      </Helmet>
      <div
        style={{
          flex: '1',
          padding: '32px 0',
        }}
      >
        <LoginForm
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw',
          }}
          logo={<img alt="logo" src="/logo.svg" />}
          title="Songgt BI"
          subTitle={'Songgt BI 是根据yupi编程导航提供项目内容编写'}
          // initialValues={{
          //   autoLogin: true,
          // }}
          submitter={{searchConfig: { submitText: '注册'}}}
          onFinish={async (values) => {
            await handleSubmit(values as API.UserRegisterRequest);
          }}
        >
          <Tabs
            activeKey={type}
            onChange={setType}
            centered
            items={[
              {
                key: 'account',
                label: '账号注册',
              },
            ]}
          />
          {type === 'account' && (
            <>
              <Form.Item
                name="userAccount"
                label="用户名"
                tooltip="你希望别人怎么称呼你?"
                rules={[{required: true, message: '请输入您的昵称!', whitespace: true}]}
              >
                <Input/>
              </Form.Item>

              <Form.Item
                name="userPassword"
                label="密码"
                rules={[
                  {
                    required: true,
                    message: '请输入您的密码!',
                  },
                ]}
                hasFeedback
              >
                <Input.Password/>
              </Form.Item>

              <Form.Item
                name="checkPassword"
                label="确认密码"
                dependencies={['userPassword']}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: '请再次输入您的密码!',
                  },
                  ({getFieldValue}) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('userPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('您输入的新密码不匹配!'));
                    },
                  }),
                ]}
              >
                <Input.Password/>
              </Form.Item>
              <div
                style={{
                  marginBottom: 24,
                }}
              >
                <Link
                  to={'../../user/login'}
                >
                  返回登录
                </Link>
              </div>
            </>
          )}
        </LoginForm>
      </div>
      <Footer/>
    </div>
  );
};
export default Register;
