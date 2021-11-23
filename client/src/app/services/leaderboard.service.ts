import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface Leaderboard {
    id: string;
    name: string;
    score: number;
}

@Injectable({
    providedIn: 'root',
})
export class LeaderboardService {
    urlString: string;
    leaderboardClassic: Leaderboard[] = [];
    leaderboardMode2990: Leaderboard[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // leaderboardClassic: any[] = [{}];

    constructor(private http: HttpClient) {
        this.urlString = 'http://localhost:3000/leaderboard';
        this.sort();
        this.getAllPlayer();
        this.getAllClassicPlayer();
    }

    // fillLeaderboardClassic(): void {
    //     this.leaderboardClassic.push(this.getAllPlayer());
    // }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getAllPlayer(): void {
        // Observable<any> {
        // const subject = new Subject<Leaderboard[]>();
        this.http.get<Leaderboard[]>(this.urlString).subscribe({
            next: (data) => {
                for (let i = 0; i < data.length; i++) {
                    // this.leaderboardClassic[i].id = data[i].id;
                    // this.leaderboardClassic[i].name = data[i].name;
                    // this.leaderboardClassic[i].score = data[i].score;
                    this.leaderboardClassic[i] = data[i];
                    // subject.next(data);
                }
            },
        });
        console.log('leaderboardClassic', this.leaderboardClassic);
        // return this.http.get(this.urlString);
        // return subject.asObservable();
    }

    sort(): void {
        this.leaderboardClassic.sort();
        this.leaderboardMode2990.sort();
    }

    getAllClassicPlayer(): void {
        const url = this.urlString + '/ClassicLeaderboard';
        this.http.get<Leaderboard[]>(url).subscribe({
            next: (data) => {
                for (let i = 0; i < data.length; i++) {
                    this.leaderboardMode2990[i] = data[i];
                }
            },
        });
    }

    addPlayer(player: Leaderboard) {
        return this.http.post(this.urlString, player);
    }

    deletePlayer(name: string) {
        const url = `${this.urlString}/${name}`;
        return this.http.delete(url);
    }
}
