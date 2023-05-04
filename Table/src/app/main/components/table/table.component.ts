import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  form!: FormGroup;
  isVisible = false;

  constructor(
    private moviesService: MoviesService,
    private route: ActivatedRoute,
    private router: Router, 
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
      title: ['', Validators.required],
      year: ['', Validators.required],
      runtime: ['', Validators.required],
      genre: ['', Validators.required],
      actors: ['', Validators.required],
      plot: ['', Validators.required],
      awards: [''],
      poster: ['', [CustomValidators.posterUrl]],
      imdbRating: [null, [CustomValidators.ratingRange(0, 10)]]
    });
  }

  deleteMovie(movie: Movie) {
    this.moviesService.deleteMovie(movie);
  }

  sortByRating() {
    this.moviesService.sortByRating();
  }

  editMovie(movie: Movie) {
    
    this.moviesList.forEach(element =>{
      element.isEditable = false;
    })
    movie.isEditable = true;
    this.moviesService.updateMovie(movie);

    // *query params
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        movieTitle: movie.title,
      },
      queryParamsHandling: 'merge',
    });
  }

  getMovieFromForm(): Movie {
    return {
      isEditable: false,
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

  showModal(): void {
    this.isVisible = true;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  handleOk(): void {
    this.isVisible = false;
    this.moviesService.addNewMovie(this.getMovieFromForm());
  }
}
