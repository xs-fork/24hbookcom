import { Flex, HStack, Image, Icon, IconButton, Spacer } from '@chakra-ui/react';
import React, { Suspense, useState } from 'react';
import { SkipNavContent, SkipNavLink } from '@chakra-ui/skip-nav';

import { Book } from './scripts/searcher';
import BooksView from './components/BooksView';
import ColorModeSwitch from './components/ColorModeSwitch';
import Footer from './components/Footer';
import Header from './components/Header';
import LanguageSwitch from './components/LanguageSwitch';
import RootContext from './store';
import Search from './components/Search';
import { version, repository } from '../package.json';
import { useTranslation } from 'react-i18next';
import getIpfsGateways from './scripts/ipfs';
import ExternalLink from './components/ExternalLink';
import { FaGithub } from 'react-icons/fa';
import BookRecommendations from './components/BookRecommendations'; // Import the new component


const Main: React.FC<{ searchComponentKey: number }> = ({ searchComponentKey }) => {
  const initialPagination = { pageSize: 20, pageIndex: 0 };
  const [pagination, setPagination] = React.useState(initialPagination);
  const [pageCount, setPageCount] = useState<number>(1);
  const [books, setBooks] = useState<Book[]>([]);
  // 使用 books.length 检查用户是否正在搜索
  const isSearching = Boolean(books.length);

  return (
    <>
      
      <SkipNavContent />
      
      <Search
        key={searchComponentKey}
        setBooks={setBooks}
        pagination={pagination}
        setPageCount={setPageCount}
        resetPageIndex={() => setPagination(initialPagination)}
      />

      {isSearching ? (
        <BooksView
          books={books}
          pagination={pagination}
          setPagination={setPagination}
          pageCount={pageCount}
        />
      ) : (
        <BookRecommendations />
      )}
    </>
  );
};



const Settings =
  import.meta.env.VITE_TAURI === '1'
    ? React.lazy(() => import('./components/Settings-tauri'))
    : React.lazy(() => import('./components/Settings'));

const App: React.FC = () => {
  const { t } = useTranslation();
  const [ipfsGateways, setIpfsGateways] = useState<string[]>([]);
  const [searchComponentKey, setSearchComponentKey] = useState<number>(0);

  React.useEffect(() => {
    getIpfsGateways().then((gateways) => {
      setIpfsGateways(gateways);
    });
  }, []);

  return (
    <RootContext.Provider value={{ ipfsGateways, setIpfsGateways }}>
      <Flex direction="column" minH="100vh">
      
        <SkipNavLink>Skip to content</SkipNavLink>
        <Header title="24h搜书网" onClick={() => setSearchComponentKey((key) => key + 1)}>
          
          <HStack spacing={{ base: 1, md: 2 }}>
          
            {/* <LanguageSwitch /> */}
            <ColorModeSwitch />
            <Suspense>
              <Settings />
            </Suspense>
          </HStack>
        </Header>

        <Main searchComponentKey={searchComponentKey} />

        <Spacer />
        <Footer>
          <ExternalLink href="https://24hbook.com">24h Book Searcher</ExternalLink> v{version} ©2023
        </Footer>
      </Flex>
    </RootContext.Provider>
  );
};

export default App;
