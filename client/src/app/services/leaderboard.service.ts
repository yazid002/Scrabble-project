import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SERVER_URL } from '@app/constants/url';
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
    leaderboardClassic: Leaderboard[];
    leaderboardMode2990: Leaderboard[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // leaderboardClassic: any[] = [{}];

    constructor(private http: HttpClient) {
        this.urlString = SERVER_URL + '/leaderboard';
    }

    // fillLeaderboardClassic(): void {
    //     this.leaderboardClassic.push(this.getAllPlayer());
    // }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getAllPlayer(): void {
        // Observable<any> {
        // const subject = new Subject<Leaderboard[]>();
        this.http.get<Leaderboard[]>(this.urlString).subscribe((data) => {
            this.leaderboardClassic = data.sort((a: Leaderboard, b: Leaderboard) => b.score - a.score);
        });
        console.log('leaderboardClassic', this.leaderboardClassic);
        // return this.http.get(this.urlString);
        // return subject.asObservable();
    }



    async getAllClassicPlayer() {
        const url = this.urlString + '/ClassicLeaderboard';
        this.http.get<Leaderboard[]>(url).subscribe((data) => {
            this.leaderboardMode2990 = data.sort((a: Leaderboard, b: Leaderboard) => b.score - a.score);
        });
    }

    async addPlayer(player: Leaderboard) {
        return this.http.post(this.urlString, player);
    }

    async deletePlayer(name: string) {
        const url = `${this.urlString}/${name}`;
        return this.http.delete(url);
    }
}
