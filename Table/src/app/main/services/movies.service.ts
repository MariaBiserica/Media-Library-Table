import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Movie } from '../interfaces/movie.interface';
import moviesData from './movies.json'; 

@Injectable({
  providedIn: 'root',
})
export class MoviesService {

  private moviesList: Movie[] = moviesData;
  moviesListSubject = new Subject<Movie[]>();

  constructor() {}

  get movies(): Movie[] {
    return this.moviesList;
  }

  set movies(moviesToSet: any) {
    this.moviesList = moviesToSet;
    this.moviesListSubject.next(moviesToSet);
  }

  deleteMovie(movie: Movie) {
    const index = this.moviesList.findIndex(() => movie);
    this.moviesList.splice(index, 1);

    this.moviesListSubject.next(this.moviesList);
  }

  addNewMovie(newMovie: Movie) {
    this.moviesList.push(newMovie);
    this.moviesListSubject.next(this.moviesList);
  }

  updateMovie(movie: Movie) {
    const index = this.moviesList.findIndex((item) => item.title === movie.title);
    this.moviesList[index] = movie;
    this.moviesListSubject.next(this.moviesList);
  }

  sortByRating() {
    this.moviesList.sort((a, b) => {
      return a.imdbRating < b.imdbRating ? 1 : -1;
    });
    this.moviesListSubject.next(this.moviesList);
  }
}
