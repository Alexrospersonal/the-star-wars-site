import { Films } from "./films.entity";

export interface FilmContainer<T> {
    addNewFilmToEntity(entity: T, film: Films): Promise<T>
}