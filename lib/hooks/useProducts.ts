import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '@/lib/store';
import {
  fetchProducts,
  fetchFeaturedProducts,
  fetchProduct,
  fetchCategories,
  setFilters,
  clearFilters,
  clearCurrentProduct,
} from '@/lib/store/slices/productSlice';

export const useProducts = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    products,
    featuredProducts,
    categories,
    currentProduct,
    reviews,
    loading,
    error,
    filters,
    pagination,
  } = useSelector((state: RootState) => state.products);

  const getProducts = useCallback((params?: any) => {
    return dispatch(fetchProducts(params));
  }, [dispatch]);

  const getFeaturedProducts = useCallback(() => {
    return dispatch(fetchFeaturedProducts());
  }, [dispatch]);

  const getProduct = useCallback((id: string) => {
    return dispatch(fetchProduct(id));
  }, [dispatch]);

  const getCategories = useCallback(() => {
    return dispatch(fetchCategories());
  }, [dispatch]);

  const updateFilters = useCallback((newFilters: any) => {
    return dispatch(setFilters(newFilters));
  }, [dispatch]);

  const resetFilters = useCallback(() => {
    return dispatch(clearFilters());
  }, [dispatch]);

  const clearProduct = useCallback(() => {
    return dispatch(clearCurrentProduct());
  }, [dispatch]);

  return {
    products,
    featuredProducts,
    categories,
    currentProduct,
    reviews,
    loading,
    error,
    filters,
    pagination,
    getProducts,
    getFeaturedProducts,
    getProduct,
    getCategories,
    updateFilters,
    resetFilters,
    clearProduct,
  };
};

export default useProducts;
