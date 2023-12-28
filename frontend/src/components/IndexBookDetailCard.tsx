import React, { Suspense, useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Flex,
  GridItem,
  Heading,
  SimpleGrid,
  Text,
  useDisclosure,
  Image,
  Stack,
  TextProps
} from '@chakra-ui/react';
import { CopyIcon, LinkIcon } from '@chakra-ui/icons';
import { useTranslation } from 'react-i18next';
import { filesize as formatFileSize } from 'filesize';

import RootContext from '../store';
import ExternalLink from './ExternalLink';
import { Book } from '../scripts/searcher';
import { getDownloadLinkFromIPFS } from '../scripts/ipfs';
import { getCoverImageUrl, getMd5CoverImageUrl, white_pic } from '../scripts/cover';
import IpfsDownloadButton from './IpfsDownloadButton';

const Preview = React.lazy(() => import('./Preview'));

interface DescriptionProps extends TextProps {
  name: string;
  children: React.ReactNode;
}
const Description: React.FC<DescriptionProps> = ({ name, children, ...props }) => {
  return (
    <Text whiteSpace="normal" wordBreak="break-all" {...props}>
      <Text as="span" fontWeight="bold">
        {name}
      </Text>
      <Text as="span">{children}</Text>
    </Text>
  );
};

export interface BookDetailViewProps {
  book: Book;
}

const IndexBookDetailView: React.FC<BookDetailViewProps> = ({ book }) => {
  const rootContext = React.useContext(RootContext);

  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [ipfsCidCopied, setIpfsCidCopied] = useState(false);
  const [md5Copied, setMd5Copied] = useState(false);

  const {
    id,
    title,
    author,
    publisher,
    extension,
    filesize,
    language,
    year,
    pages,
    isbn,
    ipfs_cid,
    cover_url,
    md5
  } = book;
  return (
    <React.Fragment>
      <Card
        mt={{ base: 1, md: 0 }}
        mb={{ base: 2, md: 0 }}
        mx={{ base: 4, lg: 0 }}
        variant="outline"
      >
        <CardHeader>
          <Flex
            align="center"
            flexWrap={{ base: 'wrap', lg: 'wrap' }}
            justify="space-between"
            gap={{ base: '4', lg: '4' }}
          >
            <Heading as="h3" fontSize={['lg', 'lg', 'lg']} whiteSpace="break-spaces" minW="0">
              <Text>{title}</Text>
            </Heading>
            <Flex gap="2">
              {/* {md5 != undefined && md5.length > 0 ? (
                <Button
                  as={ExternalLink}
                  minWidth="unset"
                  href={import.meta.env.VITE_MD5_BASE_URL + md5}
                >
                  {t('table.redirect2aa')}
                </Button>
              ) : null} */}
              {extension === 'epub' &&
                ipfs_cid != undefined &&
                ipfs_cid.length > 0 &&
                rootContext.ipfsGateways.length > 0 ? (
                <Button onClick={onOpen}>{t('table.preview')}</Button>
              ) : null}
              <Button as={ExternalLink} minWidth="unset" href="https://lib.24hbook.com" target="_blank">
                我的书库
              </Button>
            </Flex>
          </Flex>
        </CardHeader>
        <Divider />
        <CardBody>
          <Flex direction={{ base: 'column', md: 'column' }}>

            <Stack pl={{ base: undefined, md: undefined }} pt="10px" flex="1">
              <SimpleGrid columns={{ sm: 3, md: 3, lg: 3 }} spacing={{ base: 2, md: 2 }}>
                <Description name={`${t('book.id') ?? 'ID'}: `}>{id}</Description>
                <Description name={`${t('book.year') ?? 'Year'}: `}>
                  {year || t('book.unknown') || 'Unknown'}
                </Description>
                <Description name={`${t('book.filesize') ?? 'Filesize'}: `}>
                  {formatFileSize(filesize) as string}
                </Description>
                <GridItem colSpan={{ sm: 1, md: 2, lg: 3 }}>
                <Description name={`${t('book.isbn') ?? 'ISBN'}: `}>
                  {isbn || t('book.unknown') || 'Unknown'}
                </Description>
                </GridItem>
              </SimpleGrid>
            </Stack>
          </Flex>
        </CardBody>

      </Card>
      {
        isOpen ? (
          <Suspense>
            <Preview onClose={onClose} book={book} />
          </Suspense>
        ) : null
      }
    </React.Fragment >
  );
};

export default IndexBookDetailView;
