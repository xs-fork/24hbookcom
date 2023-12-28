import React, { useEffect } from 'react';
import {
  Collapse,
  Flex,
  TableProps,
  Text,
  useColorMode,
  Card,
  Image,
  Box,
  Grid,
  CardBody,
  Tag,
  Spacer,
  Center,
  CardFooter,
  Divider,
  HStack,
  Button,
  Link
} from '@chakra-ui/react';
import { useBreakpointValue } from '@chakra-ui/react';
import ExternalLink from './ExternalLink';
import { TbBook2} from 'react-icons/tb';
import {
  type ColumnDef,
  type PaginationState,
  type Row,
  getCoreRowModel,
  getExpandedRowModel,
  getSortedRowModel,
  useReactTable,
  getFilteredRowModel
} from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import IndexBookDetailView from './IndexBookDetailView';

import { Book } from '../scripts/searcher';
import { filesize as formatFileSize } from 'filesize';
import { getCoverImageUrl, getMd5CoverImageUrl, white_pic } from '../scripts/cover';
import { OnPaginationChange } from './DataTable';
import Pagination from './Pagination';
import getColorScheme from '../data/color';
import RootContext from '../store';
import MediaQuery from 'react-responsive';
import { EditIcon, ExternalLinkIcon, ViewIcon } from '@chakra-ui/icons';
import IndexIpfsDownloadButton from './IndexIpfsDownloadButton';
import IpfsDownloadButton from './IpfsDownloadButton';

const Preview = React.lazy(() => import('./Preview'));

const rendererTag = (value: string) => {
  return <Tag colorScheme={getColorScheme(value)}>{value}</Tag>;
};

export interface BookCardListProps<Data extends object> extends TableProps {
  data: Data[];
  columns: ColumnDef<Data, any>[];
  pagination: PaginationState;
  setPagination: OnPaginationChange;
  pageCount: number;
  filterSchema?: { [K in keyof Data]?: Data[K][] };
  renderSubComponent: (row: Row<Data>) => React.ReactNode;
}

export default function IndexBookCardList<Data extends object>({
  data,
  columns,
  pagination,
  setPagination,
  pageCount,
  filterSchema = {},
  renderSubComponent,
  ...props
}: BookCardListProps<Data>) {
  const { t } = useTranslation();
  const { colorMode } = useColorMode();
  const rootContext = React.useContext(RootContext);
  const gradientColors = colorMode === 'light'
    ? 'linear-gradient(60deg,#55a2f5 0%,#5fe4c6 100%)'
    : 'linear-gradient(356deg, rgb(198 246 213 / 22%) 0%, rgb(70 120 147 / 34%) 100%)';
  const bgStyle = colorMode === 'light'
    ? "linear-gradient(300deg, rgb(254, 245, 230) 0%, rgb(230, 244, 254) 10%, rgb(255, 255, 255) 50%, rgb(255, 255, 255) 60%)"
    : "linear-gradient(90deg, rgb(5, 14, 35) 0%, rgb(30, 56, 70) 100%)"; // 替换成你的深色模式背景样式

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    state: {
      pagination
    },
    pageCount,

    enableHiding: true,

    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),

    enableExpanding: true,
    getRowCanExpand: () => true,
    getExpandedRowModel: getExpandedRowModel(),

    manualPagination: true,
    // getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination
  });

  useEffect(() => {
    table.resetExpanded();
  }, [data]);

  const rows = table.getRowModel().rows.map((row) => {
    return {
      row: row,
      book: row.original as Book
    };
  });

  return (
    <Grid templateColumns={`repeat(${useBreakpointValue({ base: 1, md: 1, lg: 2, xl: 3, "2xl": 4 })}, 1fr)`} gap={4}>
      {rows.map(({ row, book }) => (
        <React.Fragment key={row.id}>
          <Card
            backgroundColor={'transparent'}
            mt={{ base: 0, md: 0 }}
            mb={{ base: 0, md: 0 }}
            ml={{ base: 4, md: 0 }}
            mr={{ base: 4, md: 0 }}

            direction="column"
            bg={bgStyle}
            overflow="hidden"

            position="relative"
          >

            <Box
              position="absolute"
              bottom="0"

              left="0"
              right="0"
              height="7px"
              background={gradientColors}
            />

            <CardBody alignSelf="left" minH="180px" h="180px">
              <Flex justifyContent="flex-start" gap={{ base: 4, md: 4 }}>

                <Image
                  referrerPolicy="no-referrer"
                  width="auto"
                  maxW="min(40%, 123px)"
                  objectFit="scale-down"
                  src={getCoverImageUrl(book.cover_url)}
                  onError={({ currentTarget }) => {
                    // 图片加载失败时的处理逻辑
                    currentTarget.src = getMd5CoverImageUrl(book.md5); // 尝试加载备用图像

                    // 备用图像加载失败后的处理
                    currentTarget.onerror = () => {
                      currentTarget.style.display = 'none';// 隐藏当前图像
                      currentTarget.src = white_pic;
                      // 检查是否已经有 "无封面" 元素存在，如果没有则创建
                      const parent = currentTarget.parentNode;
                      if (parent && !parent.querySelector('.no-cover-placeholder')) {
                        const computedStyle = window.getComputedStyle(currentTarget); // 获取计算后的样式
                        const placeholderBox = document.createElement('div');
                        placeholderBox.className = 'no-cover-placeholder';
                        placeholderBox.style.minWidth = '123px';
                        placeholderBox.style.border = '1px solid #cccccc36';
                        placeholderBox.style.width = '123px'; // 使用计算后的宽度
                        placeholderBox.style.height = '160px'; // 使用计算后的高度
                        placeholderBox.style.backgroundColor = '#efefef61'; // 灰色填充
                        placeholderBox.style.display = 'flex';
                        placeholderBox.style.alignItems = 'center';
                        placeholderBox.style.justifyContent = 'center';
                        placeholderBox.innerText = '无\n封\n面';

                        // 将 "无封面" 元素添加到当前图像的父节点，并插入到原图像的位置
                        parent.insertBefore(placeholderBox, currentTarget);
                      }
                    };
                  }}


                />

                <Box>
                  
                  <Text marginBottom={2}  lineHeight="shorter" fontSize="md" noOfLines={2}>
                    {book.title}
                  </Text>
                  
                  <Text marginBottom={0} color={'gray.500'} fontSize="xs" noOfLines={2}>
                    {book.author.length > 0 ? book.author : ''}
                    {book.author.length > 0 && book.publisher != undefined ? ' - ' : ''}
                    {book.publisher != undefined ? book.publisher : ''}
                    {book.author.length > 0 && book.year != undefined ? ' - ' : ''}
                    {book.year != undefined ? book.year : ''}
                  </Text>
                  <Text marginBottom={2} color={'gray.500'} fontSize="xs" noOfLines={2}>
                    {book.id != undefined ? ' ID: ' : ''}
                    {book.id != undefined ? book.id : ''}
                    {book.isbn.length > 0 && book.isbn != undefined ? ' - ' : ''}
                    {book.isbn.length > 0 && book.isbn != undefined ? ' ISBN: ' : ''}
                    {book.isbn != undefined ? book.isbn : ''}
                  </Text>
                  <div>
                    {rendererTag(book.extension)} {rendererTag(book.language)}{' '}
                    
                  </div>
                  <Text marginTop={2} color={'gray.500'} fontSize="lg" >
                  {formatFileSize(book.filesize) as string}
                  </Text>
                </Box>

                

              </Flex>
            </CardBody>
            <Divider borderColor={colorMode === 'light' ? 'gray.200' : 'gray.700'} />

            <CardFooter>
              <HStack >

                {book.ipfs_cid != undefined &&
                  book.ipfs_cid.length > 0 &&
                  rootContext.ipfsGateways.length > 0 ? (
                  <IndexIpfsDownloadButton book={book} onlyIcon={false}></IndexIpfsDownloadButton>
                ) : null}
                <Button width="100%" padding="0.5rem" fontWeight="normal"  variant="ghost" leftIcon={<ViewIcon />} onClick={row.getToggleExpandedHandler()}>详情</Button>
                <MediaQuery minWidth={350}>
                <Button className='bookstoreButton' as={ExternalLink} padding="0.5rem" fontWeight="normal"  variant="ghost" leftIcon={<TbBook2 />} minWidth="unset" href="https://lib.24hbook.com" target="_blank">
                  书库
                </Button>
                </MediaQuery>     
              </HStack>
            </CardFooter>
          </Card>

          <Collapse in={row.getIsExpanded()} animateOpacity unmountOnExit>
            {renderSubComponent(row)}
          </Collapse>
        </React.Fragment>
      ))}

      {data.length === 0 && (
        <Flex mt={16} mb={12} justifyContent="center">
          <Text color={colorMode === 'light' ? 'gray.400' : 'gray.600'}>{t('table.no_data')}</Text>
        </Flex>
      )}
      <Pagination
        w="full"
        mt={0}
        mr={2}
        pageCount={table.getPageCount()}
        pageIndex={pagination.pageIndex}
        setPageIndex={table.setPageIndex}
        canPreviousPage={table.getCanPreviousPage()}
        previousPage={table.previousPage}
        canNextPage={table.getCanNextPage()}
        nextPage={table.nextPage}
      />
    </Grid>
  );
}
