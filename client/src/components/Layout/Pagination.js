import React from 'react';
import classnames from 'classnames';
import { usePagination } from '../../app/hooks/usePagination.hook';
import './pagination.scss';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import Stack from '@mui/material/Stack';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const PaginationComponent = props => {
  const {
    onPageChange,
    totalCount,
    siblingCount = 1,
    currentPage,
    pageSize,
    handlePaginationChange,
  } = props

//console.log('PaginationComponent props',props)
  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });
  //console.log('paginationRange', currentPage, paginationRange)
  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  // const onNext = () => {
  //   onPageChange(currentPage + 1);
  // };

  // const onPrevious = () => {
  //   onPageChange(currentPage - 1);
  // };

  let lastPage = paginationRange[paginationRange.length - 1];
  return (
    <React.Fragment>
      <Stack spacing={2}>
        <Pagination
          count={lastPage}
          onChange={(e, page) => onPageChange(page)}
          siblingCount={2}
          boundaryCount={3}
          defaultPage={props.currentPage}
          renderItem={(item) => (
            <PaginationItem
              components={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
              {...item}
            />
          )}
        />
      </Stack>
      {/*<ul
      className={classnames('pagination-container', { [className]: className })}
    >
      <li
        className={classnames('pagination-item', {
          disabled: currentPage === 1,
        })}
        onClick={onPrevious}
      >
        <div className="arrow left" />
      </li>
      {paginationRange.map((pageNumber) => {
        if (pageNumber === DOTS) {
          return <li className="pagination-item dots">&#8230;</li>;
        }

        return (
          <li
            className={classnames('pagination-item', {
              selected: pageNumber === currentPage,
            })}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </li>
        );
      })}
      <li
        className={classnames('pagination-item', {
          disabled: currentPage === lastPage,
        })}
        onClick={onNext}
      >
        <div className="arrow right" />
      </li>
      </ul>*/}
    </React.Fragment>
  );
};

export default PaginationComponent;
