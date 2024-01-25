'use client';

import { memo, useCallback, useMemo } from 'react';
import { Box, Td, Text, Th, useToast } from '@chakra-ui/react';

// Components
import {
  Table,
  Pagination,
  CustomerNameCell,
  HeadCell,
  SearchBar,
  StatusCell,
  Fetching,
  ActionCell,
} from '@/ui/components';

// Utils
import {
  formatUppercaseFirstLetter,
  formatTransactionResponse,
} from '@/lib/utils';
import { customToast } from '@/lib/utils/toast';

// Hooks
import {
  TSortField,
  useDebounce,
  usePagination,
  useSearch,
  useTransactions,
} from '@/lib/hooks';

// Constants
import {
  COLUMNS_DASHBOARD,
  COLUMNS_HISTORY,
  ERROR_MESSAGES,
  STATUS,
  STATUS_LABEL,
  SUCCESS_MESSAGES,
  TRANSACTION_STATUS_ENUM,
} from '@/lib/constants';
import { TYPE } from '@/lib/constants/notification';

// Types
import { TDataSource, THeaderTable, TTransaction } from '@/lib/interfaces';

// Stores
import { authStore } from '@/lib/stores';

interface TFilterUserProps {
  isOpenHistoryModal?: boolean;
}

const TransactionTableComponent = ({
  isOpenHistoryModal = false,
}: TFilterUserProps) => {
  const toast = useToast();
  const userId = authStore((state) => state.user?.id);
  const { get, setSearchParam: setSearchTransaction } = useSearch();

  const {
    data: transactions = [],
    dataHistory,
    dataTransaction,
    isLoading: isLoadingTransactions,
    isError: isTransactionsError,
    sortBy,
    updateTransaction,
    deleteTransaction,
  } = useTransactions({
    name: get('name') || '',
  });

  const listData = isOpenHistoryModal ? dataHistory : dataTransaction;

  const {
    data,
    filterData,
    arrOfCurrButtons,
    isDisabledPrev,
    isDisableNext,
    resetPage,
    handleChangeLimit,
    handlePageChange,
    handlePageClick,
  } = usePagination(listData);

  const handleUpdateTransaction = useCallback(
    (updateCustomer: TTransaction) => {
      const {
        customer: { firstName, lastName, address },
      } = updateCustomer;
      updateTransaction(
        {
          transactionId: updateCustomer._id,
          userId: userId,
          firstName: firstName,
          lastName: lastName,
          state: address.state,
          street: address.street,
          city: address.city,
          zip: address.zip,
        },
        {
          onSuccess: () => {
            toast(
              customToast(
                SUCCESS_MESSAGES.UPDATE_SUCCESS.title,
                SUCCESS_MESSAGES.DELETE_SUCCESS.description,
                STATUS.SUCCESS,
              ),
            );
          },
          onError: () => {
            toast(
              customToast(
                ERROR_MESSAGES.UPDATE_TRANSACTION_FAIL.title,
                ERROR_MESSAGES.UPDATE_TRANSACTION_FAIL.description,
                STATUS.ERROR,
              ),
            );
          },
        },
      );
    },
    [updateTransaction],
  );

  const handleDeleteTransaction = useCallback(
    (updateData: Partial<TTransaction & { id: string }>) => {
      deleteTransaction(
        {
          transactionId: updateData.id,
          userId: userId,
          transactionStatus: TRANSACTION_STATUS_ENUM.ARCHIVED,
        },
        {
          onSuccess: () => {
            toast(
              customToast(
                SUCCESS_MESSAGES.DELETE_SUCCESS.title,
                SUCCESS_MESSAGES.DELETE_SUCCESS.description,
                STATUS.SUCCESS,
              ),
            );
          },
          onError: () => {
            toast(
              customToast(
                ERROR_MESSAGES.DELETE_FAIL.title,
                ERROR_MESSAGES.DELETE_FAIL.description,
                STATUS.ERROR,
              ),
            );
          },
        },
      );
    },
    [deleteTransaction],
  );

  // Update search params when end time debounce
  const handleDebounceSearch = useDebounce((value: string) => {
    resetPage();
    setSearchTransaction('name', value);
  }, []);

  const renderHead = useCallback(
    (title: string, key: string): JSX.Element => {
      const handleClick = () => {
        sortBy && sortBy(key as TSortField);
      };

      if (!title) return <Th w={50} maxW={50} />;

      return <HeadCell key={title} title={title} onClick={handleClick} />;
    },
    [sortBy],
  );

  const renderNameUser = useCallback(
    ({ id, image, name }: TDataSource): JSX.Element => (
      <CustomerNameCell id={id} key={id} image={image} name={name} />
    ),
    [],
  );

  type TStatus = keyof typeof STATUS_LABEL;

  const renderPaymentStatus = useCallback(
    ({ paymentStatus }: TDataSource): JSX.Element => (
      <StatusCell
        variant={STATUS_LABEL[`${paymentStatus}` as TStatus]}
        text={paymentStatus as string}
      />
    ),
    [],
  );

  const renderTransactionStatus = useCallback(
    ({ transactionStatus }: TDataSource): JSX.Element => (
      <StatusCell
        variant={STATUS_LABEL[`${transactionStatus}` as TStatus]}
        text={transactionStatus as string}
      />
    ),
    [],
  );

  const renderActionIcon = useCallback(
    (data: TTransaction) => (
      <ActionCell
        key={`${data._id}-action`}
        isOpenModal={!isOpenHistoryModal}
        transaction={data}
        onDeleteTransaction={handleDeleteTransaction}
        onUpdateTransaction={handleUpdateTransaction}
      />
    ),
    [],
  );

  const renderRole = useCallback(
    ({ customer: { role } }: TTransaction): JSX.Element => (
      <Td
        py={5}
        pr={5}
        pl={0}
        fontSize="md"
        color="text.primary"
        fontWeight="semibold"
        w={{ base: 150, md: 20 }}
      >
        <Text
          fontSize="md"
          fontWeight="semibold"
          whiteSpace="break-spaces"
          noOfLines={1}
          w={{ base: 100, md: 150, '3xl': 100, '6xl': 200 }}
          flex={1}
        >
          {formatUppercaseFirstLetter(role)}
        </Text>
      </Td>
    ),
    [],
  );

  const renderSpent = useCallback(({ amount, type }: TTransaction) => {
    const isAddMoney = type === TYPE.ADD_MONEY;

    return (
      <Td
        py={5}
        pr={5}
        pl={0}
        fontSize="md"
        color="text.primary"
        fontWeight="semibold"
        textAlign="left"
        w={{ base: 150, md: 20 }}
      >
        <Text
          fontSize="md"
          fontWeight="semibold"
          whiteSpace="break-spaces"
          color={isAddMoney ? 'text.primary' : 'red.500'}
          noOfLines={1}
          w={{ base: 100, md: 150, '3xl': 100, '7xl': 200 }}
          flex={1}
        >
          {amount}
        </Text>
      </Td>
    );
  }, []);

  const columns = useMemo(() => {
    if (isOpenHistoryModal) {
      return COLUMNS_HISTORY(
        renderHead,
        renderNameUser,
        renderPaymentStatus,
        renderTransactionStatus,
        renderActionIcon,
        renderSpent,
      );
    }
    return COLUMNS_DASHBOARD(
      renderHead,
      renderRole,
      renderNameUser,
      renderActionIcon,
      renderSpent,
    );
  }, [
    isOpenHistoryModal,
    renderActionIcon,
    renderHead,
    renderNameUser,
    renderPaymentStatus,
    renderRole,
    renderSpent,
    renderTransactionStatus,
  ]);

  return (
    <>
      <SearchBar
        searchValue={get('name') || ''}
        onSearch={handleDebounceSearch}
      />
      <Fetching isLoading={isLoadingTransactions} isError={isTransactionsError}>
        <Box mt={5}>
          <Table
            columns={columns as THeaderTable[]}
            dataSource={formatTransactionResponse(filterData)}
          />
        </Box>
        {!!transactions.length && (
          <Box mt={8}>
            <Pagination
              pageSize={data.limit}
              currentPage={data.currentPage}
              isDisabledPrev={isDisabledPrev}
              isDisableNext={isDisableNext}
              arrOfCurrButtons={arrOfCurrButtons}
              onLimitChange={handleChangeLimit}
              onPageChange={handlePageChange}
              onClickPage={handlePageClick}
            />
          </Box>
        )}
      </Fetching>
    </>
  );
};

const TransactionTable = memo(TransactionTableComponent);

export default TransactionTable;
