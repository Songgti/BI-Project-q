import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      links={[
        {
          key: 'Songgt BI',
          title: 'Songgt BI',
          href: 'https://github.com/Songgti/BI-Project-q',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'https://github.com/Songgti/BI-Project-q',
          blankTarget: true,
        },
        {
          key: 'Songgt BI',
          title: 'Songgt BI',
          href: 'https://github.com/Songgti/BI-Project-q',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
