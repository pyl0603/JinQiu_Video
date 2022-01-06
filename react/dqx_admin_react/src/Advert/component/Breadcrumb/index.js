import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Breadcrumb, Card } from 'antd';

import BreadcrumbNameMap from '../../layouts/menu';

const Breadcrumbs = withRouter((props) => {
  console.log('Breadcrumbs', props)
  //location 为浏览器默认的api
  const { location } = props;
  const breadcrumbNameMap = BreadcrumbNameMap;

  const url = location.pathname
  let isIndex = false;
  if ( url === '/') {
    isIndex = true;
	}
	const pathSnippets = url.split('/').filter(i => i);
  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
		const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    return (
      <Breadcrumb.Item key={url}>
        <span to={url}>{breadcrumbNameMap[url]}</span>
      </Breadcrumb.Item>
    );
	});
  const breadcrumbItems = [
    <Breadcrumb.Item key="home">
      <Link to="/">首页</Link>
    </Breadcrumb.Item>,
	].concat(extraBreadcrumbItems);

  return (
    isIndex ? null :
    <Card>
			<Breadcrumb>
      	{breadcrumbItems}
			</Breadcrumb>
		</Card>
  );
});

export default Breadcrumbs;
