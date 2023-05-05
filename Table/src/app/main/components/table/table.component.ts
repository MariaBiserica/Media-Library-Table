import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Movie } from '../../interfaces/movie.interface';
import { MoviesService } from '../../services/movies.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from '../../helpers/validators';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {

  moviesList!: Movie[];
  initialMovie!: Movie;
  form!: FormGroup;
  isVisible: boolean = false;
  isDisabled: boolean = true;
  isInEditMode: boolean = false;

  constructor(
    private moviesService: MoviesService,
    private route: ActivatedRoute, 
    private fb: FormBuilder
  ) {
    this.route.queryParams.subscribe((res: any) => {
      console.log(res);
    });

    this.moviesService.moviesListSubject.subscribe((res: any) => {
      this.moviesList = [...res];
      console.log('in subscribe ');
    });
  }

  ngOnInit(): void {
    this.moviesList = this.moviesService.movies;
    console.log(this.moviesList);
    this.form = this.fb.group({
      title: ['', [Validators.required]],
      year: ['', [Validators.required]],
      runtime: ['', [Validators.required]],
      genre: ['', [Validators.required]],
      actors: ['', [Validators.required]],
      plot: ['', [Validators.required, CustomValidators.descriptionWordsCount(5)]],
      awards: [''],
      poster: ['', [Validators.required, CustomValidators.posterUrl]],
      imdbRating: [null, [Validators.required, CustomValidators.ratingRange(0, 10)]]
    });

    this.form.valueChanges.subscribe(() => {
      this.isDisabled = this.form.invalid;
    });
  }

  deleteMovie(movie: Movie) {
    this.moviesService.deleteMovie(movie);
  }

  sortByRating() {
    this.moviesService.sortByRating();
  }

  editMovie(movie: Movie) {
    this.initialMovie = movie;

    this.isInEditMode = true;
    this.form.setValue({
      title: movie.title,
      year: movie.year,
      runtime: movie.runtime,
      genre: movie.genre,
      actors: movie.actors,
      plot: movie.plot,
      awards: movie.awards,
      poster: movie.poster,
      imdbRating: movie.imdbRating
    });

    this.showModal();
  }

  showModal(): void {
    this.isVisible = true;
  }

  getMovieFromForm(): Movie {
    return {
      title: this.form.value.title,
      year: this.form.value.year,
      runtime: this.form.value.runtime,
      genre: this.form.value.genre,
      actors: this.form.value.actors,
      plot: this.form.value.plot,
      awards: this.form.value.awards,
      poster: this.form.value.poster,
      imdbRating: this.form.value.imdbRating
    };
  }

  handleCancel(): void {
    this.isVisible = false;
    this.form.reset();
  }

  handleOk(): void {
    if(this.isInEditMode){
      this.isInEditMode = false;
      this.moviesService.updateMovie(this.initialMovie, this.getMovieFromForm());
    }
    else{
      this.moviesService.addNewMovie(this.getMovieFromForm());
    }

    this.isVisible = false;
    this.form.reset();
  }
}
