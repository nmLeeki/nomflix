import styled from "styled-components";
import { motion, useScroll } from "framer-motion";
import { PathMatch, useMatch, useNavigate } from "react-router-dom";
import { makeImagePath } from "../utills";
import { useQuery } from "react-query";
import { getMovie, getTv, IGetMovie, IgetTv } from "../api";
import InfoStarRate from "./InfoStarRate";
import { useState } from "react";

export const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  background-color: rgba(0, 0, 0, 0.7);
`;

export const MovieInfo = styled(motion.div)<{ scrolly: number }>`
  z-index: 999;
  position: absolute; //scrolly를 사용하지않고 화면기준인 fixed 를 사용해도된다
  width: 80%;
  max-width: 750px;
  height: 90vh;
  top: ${(props) => props.scrolly + 50}px;
  right: 0;
  left: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  overflow-y: auto;
  background-color: ${(props) => props.theme.black.darker};

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const MovieInfoCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 40vh;
  display: flex;
  align-items: flex-end;
  justify-content: center;
`;
export const MovieInfoPoster = styled.img`
  width: 25%;
  border-radius: 15px;
  box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.5);
`;

export const MovieInfoWrapper = styled.div`
  overflow: hidden;
  margin: 0px 20px;
  display: flex;
  flex-direction: column;
`;

export const MovieInfoTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  font-size: min(46px, 5vw);
  font-weight: 500;
  max-width: 80%;
`;
const MovieInfoTagline = styled.h5`
  font-size: min(3vw, 2em);
  margin-bottom: 3px;
`;
export const MovieInfoGenres = styled.div`
  font-size: 1em;
  ul {
    li {
      border-radius: 3px;
      padding: 1px;
      color: ${(props) => props.theme.white.lighter};
      background-color: ${(props) => props.theme.black.lighter};
      float: left;
      margin-right: 4px;
      margin-bottom: 3px;
    }
  }

  @media screen and (max-width: 500px) {
    font-size: 0.5em;
  }
`;
const MovieInfoTime = styled.div`
  font-size: 0.8em;
  span {
    color: ${(props) => props.theme.white.lighter};
  }

  @media screen and (max-width: 500px) {
    font-size: 0.4em;
  }
`;
export const MovieInfoVote = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px;

  span:nth-of-type(1) {
    font-size: 2.3vw;
    color: #ffd400;
    font-weight: 400;
  }
  span:last-of-type {
    font-size: 1.3vw;
    font-weight: 400;
  }

  @media screen and (max-width: 500px) {
    margin: -10px 0 -5px 0;
  }
`;

export const MovieInfoOverview = styled.p`
  color: ${(props) => props.theme.white.lighter};
  margin-bottom: 20px;
  font-size: 1em;

  @media screen and (max-width: 500px) {
    font-size: 0.5em;
  }
`;

export const SimilarMoviesTitle = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  h3 {
    font-size: 1.1em;
    font-weight: 400;
  }
  @media screen and (max-width: 500px) {
    font-size: 0.7em;
  }
`;
export const SimilarMovies = styled.div`
  display: flex;
  overflow: auto;
  margin-bottom: 20px;
  &::-webkit-scrollbar {
    height: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${(props) => props.theme.white.darker};
    border-radius: 10px;
  }
  &::-webkit-scrollbar-track {
    border-radius: 10px;
    background-color: ${(props) => props.theme.black.lighter};
    box-shadow: inset 0px 0px 5px rgba(0, 0, 0, 0.2);
  }
`;

export const SimilarMovie = styled(motion.div)`
  margin-right: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;

  cursor: pointer;

  &:hover {
    h3 {
      color: ${(props) => props.theme.white.lighter};
      font-weight: 400;
    }
  }

  @media screen and (max-width: 500px) {
    h3 {
      font-size: 0.5em;
    }
  }
`;

export const SimilarMovieImg = styled.img`
  border-radius: 5px;
  width: 135px;
  height: 80px;
  margin-bottom: 5px;

  background-color: ${(props) => props.theme.black.veryDark};
  display: flex;
  align-items: center;
  justify-content: center;
  span {
    color: ${(props) => props.theme.white.lighter};
  }
`;

export interface IInfoProps {
  programId: number;
  rowIndex?: number | string | null;
  search?: string;
}

export default function Info({ programId, rowIndex, search }: IInfoProps) {
  const navigate = useNavigate();
  const moviePathMatch: PathMatch<string> | null = useMatch("/movie/:id");
  const { scrollY } = useScroll();
  const [similarClicked, setSimilarClicked] = useState(false);
  const { data, isLoading } = useQuery<IGetMovie>(["movie", programId], () =>
    getMovie(programId)
  );

  const onOverlayClick = () => {
    search ? navigate(`/search?keyword=${search}`) : navigate("/");
  };

  const onSimilarMovieClick = (programId: number) => {
    search
      ? navigate(`/search?keyword=${search}&id=${programId}`)
      : navigate(`/movie/${programId}`);
    setSimilarClicked(true);
  };

  return (
    <>
      {similarClicked ? (
        <>
          {setSimilarClicked(false)}
          <Info programId={Number(moviePathMatch?.params.id)} rowIndex={null} />
        </>
      ) : (
        <>
          <Overlay
            onClick={onOverlayClick}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <MovieInfo
            scrolly={scrollY.get()}
            layoutId={String((rowIndex + "_" || "") + programId)}
          >
            {isLoading ? null : (
              <>
                <MovieInfoCover
                  style={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,0),#181818), url(${makeImagePath(
                      data?.movie_detail.backdrop_path + "",
                      "w500"
                    )})`,
                  }}
                >
                  <MovieInfoPoster
                    src={makeImagePath(
                      data?.movie_detail.poster_path + "",
                      "w500"
                    )}
                  />
                </MovieInfoCover>
                <MovieInfoWrapper>
                  <MovieInfoTitle>{data?.movie_detail.title}</MovieInfoTitle>
                  <MovieInfoTagline>
                    {data?.movie_detail.tagline}
                  </MovieInfoTagline>
                  <MovieInfoGenres>
                    <span>장르</span>
                    <ul>
                      {data?.movie_detail.genres.map((i) => (
                        <li key={i.id}>{i.name}</li>
                      ))}
                    </ul>
                  </MovieInfoGenres>
                  <MovieInfoTime>
                    개봉일: <span>{data?.movie_detail.release_date}</span>
                    <br />
                    상영시간: <span>{data?.movie_detail.runtime} 분</span>
                  </MovieInfoTime>
                  <MovieInfoVote>
                    <InfoStarRate
                      rate={data?.movie_detail.vote_average as number}
                    />

                    <span style={{ marginTop: "3px", marginRight: "10px" }}>
                      {data?.movie_detail.vote_average?.toFixed(1)}
                    </span>
                    <span style={{ marginTop: "3px" }}>
                      ({data?.movie_detail.vote_count?.toLocaleString("ko-KR")}
                      명이 투표함)
                    </span>
                  </MovieInfoVote>
                  <MovieInfoOverview>
                    {data?.movie_detail.overview}
                  </MovieInfoOverview>

                  <SimilarMoviesTitle>
                    <h3>비슷한 영화</h3>
                    <h3>총 {data?.similar_movies.results.length}편</h3>
                  </SimilarMoviesTitle>

                  <SimilarMovies>
                    {data?.similar_movies.results.map((movie) => (
                      <SimilarMovie
                        layoutId={"" + movie.id}
                        key={movie.id}
                        onClick={() => {
                          onSimilarMovieClick(movie.id);
                        }}
                      >
                        {movie.backdrop_path ? (
                          <SimilarMovieImg
                            src={makeImagePath(movie.backdrop_path, "w500")}
                          />
                        ) : (
                          <SimilarMovieImg as="div">
                            <span>이미지 없음</span>
                          </SimilarMovieImg>
                        )}

                        <h3>{movie.title}</h3>
                      </SimilarMovie>
                    ))}
                  </SimilarMovies>
                </MovieInfoWrapper>
              </>
            )}
          </MovieInfo>
        </>
      )}
    </>
  );
}
