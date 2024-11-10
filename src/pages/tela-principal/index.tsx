'use client'
import { useEffect, useState } from 'react';
import { TextField, Grid, Typography, CircularProgress, Avatar, Box, Select, MenuItem, Button } from '@mui/material';
import { getLivros } from '../../lib/api';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

interface VolumeInfo {
  title: string;
  authors?: string[];
  categories?: string[];
  averageRating?: number;
  imageLinks?: {
    thumbnail?: string;
  };
}

interface Book {
  id: string;
  volumeInfo: VolumeInfo;
}

type SortCriteria = 'title' | 'rating' | 'author';
type SortOrder = 'asc' | 'desc';

export function TelaPrincipal() {
  const [query, setQuery] = useState<string>('');
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<SortCriteria>('title');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const fetchBooks = async (searchQuery: string) => {
    setLoading(true);
    try {
      const data = await getLivros(searchQuery);
      setBooks(data.items || []);
    } catch (error) {
      console.error("Erro ao buscar livros:", error);
    } finally {
      setLoading(false);
    }
  };

  const sortBooks = (books: Book[], criteria: SortCriteria, order: SortOrder): Book[] => {
    const sorted = [...books].sort((a, b) => {
      const volumeA = a.volumeInfo;
      const volumeB = b.volumeInfo;

      if (criteria === 'title') {
        return volumeA.title.localeCompare(volumeB.title);
      }
      if (criteria === 'rating') {
        const ratingA = volumeA.averageRating ?? 0;
        const ratingB = volumeB.averageRating ?? 0;
        return ratingB - ratingA;
      }
      if (criteria === 'author') {
        const authorA = volumeA.authors?.[0] || '';
        const authorB = volumeB.authors?.[0] || '';
        return authorA.localeCompare(authorB);
      }
      return 0;
    });

    return order === 'asc' ? sorted : sorted.reverse();
  };

  useEffect(() => {
    if (query === '') {
      fetchBooks('popular books');
    } else {
      fetchBooks(query);
    }
  }, [query]);

  const sortedBooks = sortBooks(books, sortBy, sortOrder);

  return (
    <div style={{ padding: 20, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        BookStats - Lista de Livros
      </Typography>

      <TextField
        label="Buscar Livros"
        variant="outlined"
        fullWidth
        value={query}
        onChange={(e) => { setQuery(e.target.value); fetchBooks(e.target.value) }}
        style={{ marginBottom: 20 }}
      />

      <div style={{ marginBottom: 40 }}>
        <Select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortCriteria)}
          style={{ marginRight: 10 }}
        >
          <MenuItem value="title">Ordenar por Nome</MenuItem>
          <MenuItem value="rating">Ordenar por Nota</MenuItem>
          <MenuItem value="author">Ordenar por Autor</MenuItem>
        </Select>

        <Button
          variant="contained"
          color="primary"
          onClick={() => sortOrder=='asc'?(setSortOrder('desc')):(setSortOrder('asc'))}
          style={{ marginRight: 10 }}
        >
          {sortOrder=='asc'?(<KeyboardArrowDownIcon/>):(<KeyboardArrowUpIcon/>)}
        </Button>
      </div>

      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {sortedBooks.map((book) => {
            const volumeInfo = book.volumeInfo;
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={book.id}>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Avatar
                    variant="square"
                    src={volumeInfo.imageLinks?.thumbnail}
                    alt={volumeInfo.title}
                    sx={{ width: 100, height: 150, marginBottom: 2 }}
                  />
                  <Typography variant="h6">{volumeInfo.title}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {volumeInfo.authors?.join(', ') || 'Autor desconhecido'}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Gênero: {volumeInfo.categories?.join(', ') || 'Desconhecido'}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Avaliação Média: {volumeInfo.averageRating ? volumeInfo.averageRating : 'Sem avaliação'}
                  </Typography>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      )}
    </div>
  );
}
