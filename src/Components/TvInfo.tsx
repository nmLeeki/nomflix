import styled from "styled-components";
import { useScroll } from "framer-motion";
import { PathMatch, useMatch, useNavigate } from "react-router-dom";
import { makeImagePath } from "../utills";
import { useQuery } from "react-query";
import { getTv, IgetTv } from "../api";
import InfoStarRate from "./InfoStarRate";
import { useState } from "react";
import {
  MovieInfo as TvDetailInfo,
  MovieInfoWrapper as TvInfoWrapper,
  MovieInfoCover as TvInfoCover,
  MovieInfoGenres as TvInfoGenres,
  MovieInfoOverview as TvInfoOverview,
  MovieInfoPoster as TvInfoPoster,
  MovieInfoTitle as TvInfoTitle,
  MovieInfoVote as TvInfoVote,
  Overlay,
  SimilarMovie as SimilarTv,
  SimilarMovieImg as SimilarTvImg,
  SimilarMovies as SimilarTvShow,
  SimilarMoviesTitle as SimilarTvShowTitle,
} from "./Info";

const TvInfoSeasons = styled.ul`
  font-size: 1.2vw;
  position: relative;
`;

const TvInfoSeason = styled.li`
  border-radius: 3px;
  padding: 1px;
  color: ${(props) => props.theme.white.lighter};
  background-color: ${(props) => props.theme.black.lighter};
  float: left;
  margin-right: 4px;
  margin-bottom: 3px;
  &:hover {
    filter: brightness(1.5);
  }
`;

const TvInfoSeasonOverview = styled.p`
  background-color: ${(props) => props.theme.black.lighter};
  color: ${(props) => props.theme.white.lighter};
  width: 100%;
  opacity: 0.9;
  padding: 10px;
  top: 100px;
  position: absolute;
  font-size: 1.5em;
  @media screen and (max-width: 500px) {
    font-size: 1em;
    top: 50px;
  }
`;

export interface ITvInfoProps {
  programId: number;
  rowIndex?: number | string | null;
  search?: string;
}

export default function TvInfo({ programId, rowIndex, search }: ITvInfoProps) {
  const navigate = useNavigate();
  const moviePathMatch: PathMatch<string> | null = useMatch("/tv/:id");
  const { scrollY } = useScroll();
  const [similarClicked, setSimilarClicked] = useState(false);
  const [showSeasonOverview, setShowSeasonOverview] = useState<number | null>(
    null
  );
  const { data, isLoading } = useQuery<IgetTv>(["tv", programId], () =>
    getTv(programId)
  );
  const onOverlayClick = () => {
    search ? navigate(`/search?keyword=${search}`) : navigate("/tv");
  };
  const onSimilarMovieClick = (programId: number) => {
    search
      ? navigate(`/search?keyword=${search}&id=${programId}`)
      : navigate(`/tv/${programId}`);
    setSimilarClicked(true);
  };
  return (
    <>
      {similarClicked ? (
        <>
          {setSimilarClicked(false)}
          <TvInfo
            programId={Number(moviePathMatch?.params.id)}
            rowIndex={null}
          />
        </>
      ) : (
        <>
          <Overlay
            onClick={onOverlayClick}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <TvDetailInfo
            scrolly={scrollY.get()}
            layoutId={String((rowIndex + "_" || "") + programId)}
          >
            {isLoading ? null : (
              <>
                <TvInfoCover
                  style={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,0),#181818), url(${makeImagePath(
                      data?.tv_detail.backdrop_path + "",
                      "w500"
                    )})`,
                  }}
                >
                  <TvInfoPoster
                    src={makeImagePath(
                      data?.tv_detail.poster_path + "",
                      "w500"
                    )}
                  />
                </TvInfoCover>
                <TvInfoWrapper>
                  <TvInfoTitle>{data?.tv_detail.name}</TvInfoTitle>
                  <TvInfoSeasons>
                    {data?.tv_detail.seasons.map((i) => (
                      <div key={i.id}>
                        <TvInfoSeason
                          onMouseEnter={() => setShowSeasonOverview(i.id)}
                          onMouseLeave={() => setShowSeasonOverview(null)}
                        >
                          {i.name}
                        </TvInfoSeason>
                        {showSeasonOverview !== i.id ? null : i.overview ===
                          "" ? null : (
                          <TvInfoSeasonOverview>
                            {i.overview}
                          </TvInfoSeasonOverview>
                        )}
                      </div>
                    ))}
                  </TvInfoSeasons>
                  <TvInfoGenres>
                    <span>장르</span>
                    <ul>
                      {data?.tv_detail.genres.map((i) => (
                        <li key={i.id}>{i.name}</li>
                      ))}
                    </ul>
                  </TvInfoGenres>
                  <TvInfoVote>
                    <InfoStarRate
                      rate={data?.tv_detail.vote_average as number}
                    />

                    <span style={{ marginTop: "3px", marginRight: "10px" }}>
                      {data?.tv_detail.vote_average?.toFixed(1)}
                    </span>
                    <span style={{ marginTop: "3px" }}>
                      ({data?.tv_detail.vote_count?.toLocaleString("ko-KR")}
                      명이 투표함)
                    </span>
                  </TvInfoVote>
                  <TvInfoOverview>{data?.tv_detail.overview}</TvInfoOverview>

                  <SimilarTvShowTitle>
                    <h3>비슷한 프로그램</h3>
                    <h3>총 {data?.similar_tvShow.results.length}편</h3>
                  </SimilarTvShowTitle>

                  <SimilarTvShow>
                    {data?.similar_tvShow.results.map((tv) => (
                      <SimilarTv
                        layoutId={"" + tv.id}
                        key={tv.id}
                        onClick={() => {
                          onSimilarMovieClick(tv.id);
                        }}
                      >
                        {tv.backdrop_path ? (
                          <SimilarTvImg
                            src={makeImagePath(tv.backdrop_path, "w500")}
                          />
                        ) : (
                          <SimilarTvImg as="div">
                            <span>이미지 없음</span>
                          </SimilarTvImg>
                        )}
                        <h3>{tv.name}</h3>
                      </SimilarTv>
                    ))}
                  </SimilarTvShow>
                </TvInfoWrapper>
              </>
            )}
          </TvDetailInfo>
        </>
      )}
    </>
  );
}
