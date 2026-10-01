export interface DailyBoxOfficeItem {
  rnum: string;
  rank: string;
  rankInten: string;
  rankOldAndNew: 'OLD' | 'NEW';
  movieCd: string;
  movieNm: string;
  openDt: string;
  salesAmt: string;
  salesShare: string;
  salesInten: string;
  salesChange: string;
  salesAcc: string;
  audiCnt: string;
  audiInten: string;
  audiChange: string;
  audiAcc: string;
  scrnCnt: string;
  showCnt: string;
}

export interface BoxOfficeResult {
  boxofficeType: string;
  showRange: string;
  dailyBoxOfficeList: DailyBoxOfficeItem[];
}

export interface DailyBoxOfficeResponse {
  boxOfficeResult?: BoxOfficeResult;
  faultInfo?: {
    message: string;
    errorCode: string;
  };
}

export interface MovieActor {
  peopleNm: string;
  peopleNmEn: string;
  cast?: string;
  castEn?: string;
}

export interface MovieDirector {
  peopleNm: string;
  peopleNmEn: string;
}

export interface MovieCompany {
  companyCd: string;
  companyNm: string;
  companyNmEn?: string;
  companyPartNm: string;
}

export interface MovieAudit {
  auditNo: string;
  watchGradeNm: string;
}

export interface MovieShowType {
  showTypeGroupNm: string;
  showTypeNm: string;
}

export interface MovieStaff {
  peopleNm: string;
  peopleNmEn: string;
  staffRoleNm: string;
}

export interface MovieInfo {
  movieCd: string;
  movieNm: string;
  movieNmEn: string;
  movieNmOg: string;
  showTm: string;
  prdtYear: string;
  openDt: string;
  prdtStatNm: string;
  typeNm: string;
  nations: Array<{ nationNm: string }>;
  genres: Array<{ genreNm: string }>;
  directors: MovieDirector[];
  actors: MovieActor[];
  showTypes: MovieShowType[];
  companys: MovieCompany[];
  audits: MovieAudit[];
  staffs: MovieStaff[];
}

export interface MovieInfoResult {
  movieInfo: MovieInfo;
  source?: string;
}

export interface MovieInfoResponse {
  movieInfoResult?: MovieInfoResult;
  faultInfo?: {
    message: string;
    errorCode: string;
  };
}

export type ViewMode = 'table' | 'cards';
export type NationFilter = 'ALL' | 'K' | 'F'; // All, Korean, Foreign
