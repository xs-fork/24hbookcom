import React, { useState, useEffect } from 'react';
import { Tab, TabList, TabPanel, TabPanels, Tabs, Flex, Button } from '@chakra-ui/react';
import BooksView, { BooksViewProps } from './BooksView';
import { Book, SearchQuery } from '../scripts/searcher';
import { ArrowForwardIcon } from '@chakra-ui/icons';

const BookRecommendations: React.FC = () => {
  const categories = ['文学', '历史', '经济', '科学', '小说'];

  const [booksByCategory, setBooksByCategory] = useState<{ [key: string]: Book[] }>({});

  useEffect(() => {
    const fetchBooksForAllCategories = async () => {
      const promises = categories.map(async (category) => {
        const books = await fetchRandomBooks(category);
        return { [category]: books };
      });
  
      const booksByCategoryArray = await Promise.all(promises);
      const combinedBooksByCategory = Object.assign({}, ...booksByCategoryArray);
      setBooksByCategory(combinedBooksByCategory);
    };
  
    fetchBooksForAllCategories();
  }, []);
  

  const fetchRandomBooks = async (category: string): Promise<Book[]> => {
    // Perform API request to fetch random books for the given category
    const response = await fetchBooks({ query: removeEmoji(category), limit: 30, offset: 0 });
    return response.books;
  };

  const fetchBooksByCategory = async (category: string): Promise<Book[]> => {
    // Perform API request to fetch all books for the given category
    const response = await fetchBooks({ query: removeEmoji(category), limit: 100, offset: 0 });
    return response.books;
  };

  const handleViewAllClick = async (category: string) => {
    // Perform API request to fetch all books for the given category
    const books = await fetchBooksByCategory(category);
    setBooksByCategory((prev) => ({ ...prev, [category]: books }));
  };

  const fetchBooks = async (query: SearchQuery): Promise<{ books: Book[] }> => {
    const params = new URLSearchParams(query as unknown as Record<string, string>); // 将类型断言改为 Record<string, string>
  
    const response = await fetch(`https://24hbook.com/search?${params.toString()}`, {
      method: 'GET',
    });
  
    const data = await response.json();
    console.log('Request URL:', `https://24hbook.com/search?${params.toString()}`);
  
    return { books: data.books || [] };
  };
  
  
  
  

  // Helper function to remove emoji from category
  const removeEmoji = (text: string): string => text.replace(/[\u{1F600}-\u{1F6FF}]/gu, '');

  return (
    <Flex direction={{ base: 'row' }} px={{ base: 4, md: 8 }} py={0} align="center" mt={4} mb={4}>
      <Tabs width="100%" variant='soft-rounded' colorScheme='green'>
        <TabList>
          {categories.map((category) => (
            <Tab key={category}>{removeEmoji(category)}</Tab>
          ))}
        </TabList>
        <TabPanels>
          {categories.map((category) => (
            <TabPanel key={category}>
              <Flex direction="column">
                <BooksView
                  books={booksByCategory[category] || []}
                  pagination={{ pageSize: 20, pageIndex: 0 }}
                  setPagination={(pagination) => console.log(pagination)}
                  pageCount={1}
                />
                <Button rightIcon={<ArrowForwardIcon />} variant='link' mt={4} onClick={() => handleViewAllClick(category)}>
                  查看全部
                </Button>
              </Flex>
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Flex>
  );
};

export default BookRecommendations;
