import React, { useState, useEffect } from 'react';
import { Tab, TabList, TabPanel, TabPanels, Tabs, Flex, Button } from '@chakra-ui/react';
import BooksView, { BooksViewProps } from './BooksView';
import { Book, SearchQuery } from '../scripts/searcher';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import search from '../scripts/searcher'; // Import the search function

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
    const response = await search({ query: removeEmoji(category), limit: 30, offset: 0 });
    return response.bobooks ? booksByCategory[category] : [];
  };

  const fetchBooksByCategory = async (category: string): Promise<Book[]> => {
    // Perform API request to fetch all books for the given category
    const response = await search({ query: removeEmoji(category), limit: 100, offset: 0 });
    return response.books;
  };

  const handleViewAllClick = async (category: string) => {
    // Perform API request to fetch all books for the given category
    const books = await fetchBooksByCategory(category);
    setBooksByCategory((prev) => ({ ...prev, [category]: books }));
  };

  // Helper function to remove emoji from category
  const removeEmoji = (text: string): string => text.replace(/[\u{1F600}-\u{1F6FF}]/gu, '');

  return (
    <Flex direction={{ base: 'row' }} px={{ base: 0, md: 8 }} py={0} align="center" mt={4} mb={4}>
      <Tabs width="100%" variant='soft-rounded' colorScheme='green'>
        <TabList>
          {categories.map((category) => (
            <Tab key={category}>{removeEmoji(category)}</Tab>
          ))}
        </TabList>
      <TabPanels px ="0">
        {categories.map((category) => (
          <TabPanel key={category} px={0}>
            <Flex direction="column">
              {booksByCategory[category] ? (
                <BooksView
                  books={booksByCategory[category]}
                  pagination={{ pageSize: 20, pageIndex: 0 }}
                  setPagination={(pagination) => console.log(pagination)}
                  pageCount={1}
                />
              ) : (
                <p>没有书籍可显示</p>
              )}
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
