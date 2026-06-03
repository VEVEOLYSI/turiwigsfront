import { createSlice } from '@reduxjs/toolkit';

interface UiState {
  mobileMenuOpen: boolean;
  searchOpen: boolean;
}

const uiSlice = createSlice({
  name: 'ui',
  initialState: { mobileMenuOpen: false, searchOpen: false } as UiState,
  reducers: {
    openMobileMenu: (s) => { s.mobileMenuOpen = true; },
    closeMobileMenu: (s) => { s.mobileMenuOpen = false; },
    toggleMobileMenu: (s) => { s.mobileMenuOpen = !s.mobileMenuOpen; },
    openSearch: (s) => { s.searchOpen = true; },
    closeSearch: (s) => { s.searchOpen = false; },
  },
});

export const { openMobileMenu, closeMobileMenu, toggleMobileMenu, openSearch, closeSearch } =
  uiSlice.actions;
export default uiSlice.reducer;
