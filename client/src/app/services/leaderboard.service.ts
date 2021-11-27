import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SERVER_URL } from '@app/constants/url';
export interface Leaderboard {
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

    constructor(private http: HttpClient) {
        this.urlString = SERVER_URL + '/leaderboard';
    }

    async fetchClassic() {
        const getClassicUrl = this.urlString;
        await this.http.get<Leaderboard[]>(getClassicUrl).subscribe((data) => {
            this.leaderboardClassic = this.sortLeaderBoard(data);
        });
    }
    async fetchLog2990() {
        const getlog2990Url = this.urlString + '/ClassicLeaderboard';
        await this.http.get<Leaderboard[]>(getlog2990Url).subscribe((data) => {
            this.leaderboardMode2990 = this.sortLeaderBoard(data);
        });
    }
    sortLeaderBoard(data: Leaderboard[]): Leaderboard[] {
        return data.sort((a: Leaderboard, b: Leaderboard) => b.score - a.score);
    }

    async addPlayer(player: Leaderboard) {
        console.log('bbb');
        console.log(this.urlString);
        console.log(player);
        this.http.post<Leaderboard>(this.urlString, player).subscribe();
    }

    async deletePlayer(name: string) {
        const url = `${this.urlString}/${name}`;
        console.log(url);
        return this.http.delete(url).subscribe();
    }
}
