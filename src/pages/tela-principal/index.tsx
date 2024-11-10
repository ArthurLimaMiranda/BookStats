'use client'
import { useEffect, useState } from 'react';
import { TextField, Grid, Typography, CircularProgress, Avatar, Box } from '@mui/material';
import { getLivros } from '../../lib/api';

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

export function TelaPrincipal() {

  const [query, setQuery] = useState<string>('');
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

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

  useEffect(() => {
    fetchBooks('popular books');
  }, []);
  

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

      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {books.map((book) => {
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
