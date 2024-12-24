import { Observer } from "@/Views/Observer";

export class Observable {
    private _observers: Observer[] = [];

    public addObserver(observer: Observer): void {
        this._observers.push(observer);
    }

    public removeObserver(observer: Observer): void {
        this._observers = this._observers.filter(o => o !== observer);
    }

    public notifyObservers(data: any): void {
        this._observers.forEach(observer => observer.update(data));
    }
}