import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import Home from '../Home';
import { ThemeProvider } from '../../context/ThemeContext';

describe('Home Page Integration', () => {
  it('renders home page successfully', () => {
    const { container } = render(
      <BrowserRouter>
        <ThemeProvider>
          <Home />
        </ThemeProvider>
      </BrowserRouter>
    );

    expect(container).toBeDefined();
  });
});
