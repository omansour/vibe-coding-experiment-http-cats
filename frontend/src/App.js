import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { 
  AppLayout, 
  SideNavigation, 
  Header,
  ContentLayout
} from '@cloudscape-design/components';
import HttpCodeList from './components/HttpCodeList';
import HttpCodeDetail from './components/HttpCodeDetail';
import TryUrl from './components/TryUrl';
import { loadConfig } from './utils/config';

function App() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const configData = await loadConfig();
        setConfig(configData);
      } catch (error) {
        console.error('Error loading config:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const navigationItems = [
    {
      type: 'section',
      text: 'HTTP Codes',
      items: [
        { type: 'link', text: 'HTTP Code List', href: '/' }
      ]
    },
    {
      type: 'section',
      text: 'Tools',
      items: [
        { type: 'link', text: 'Try a URL', href: '/try-url' }
      ]
    }
  ];

  const onNavigate = (event) => {
    if (!event.detail.external) {
      event.preventDefault();
      navigate(event.detail.href);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AppLayout
      navigation={
        <SideNavigation
          activeHref={location.pathname}
          header={{ text: 'HTTP Codes App', href: '/' }}
          items={navigationItems}
          onFollow={onNavigate}
        />
      }
      content={
        <ContentLayout
          header={
            <Header variant="h1">
              HTTP Codes Educational App
            </Header>
          }
        >
          <Routes>
            <Route path="/" element={<HttpCodeList config={config} />} />
            <Route path="/code/:httpCode" element={<HttpCodeDetail config={config} />} />
            <Route path="/try-url" element={<TryUrl config={config} />} />
          </Routes>
        </ContentLayout>
      }
    />
  );
}

export default App;
