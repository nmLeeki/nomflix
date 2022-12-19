import { useQuery } from "react-query";
import { getMovies, IGetMovies, IGetProgramResult, IProgram } from "../api";
import styled from "styled-components";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useNavigate, useMatch, PathMatch } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Banner from "../Components/Banner";
import Info from "../Components/Info";
import Slider from "../Components/Slider";

export const Wrapper = styled.div`
  overflow-x: hidden;
`;

export const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const MOVIE = "movie";
const NOWPLAYING = 0;
const POPULAR = 1;
const TOP_RATED = 2;
const UPCOMING = 3;

export default function Home() {
  const navigate = useNavigate();
  const moviePathMatch: PathMatch<string> | null = useMatch(`/${MOVIE}/:id`);
  const { data, isLoading } = useQuery<IGetMovies>(["movies"], getMovies);
  /** 전역 라이브러리 사용 해서 구현해도 됨 */
  const [rowIndex, setRowIndex] = useState<number | null>(null);
  const onBoxClicked = (movieId: number, rowIndex: number) => {
    setRowIndex(rowIndex);
    navigate(`/${MOVIE}/${movieId}`);
  };
  return (
    <Wrapper>
      <Helmet>
        <title>홈 - 넷플릭스</title>
      </Helmet>
      {isLoading ? (
        <Loader>로딩 중...</Loader>
      ) : (
        <>
          <Banner
            selected={MOVIE}
            program={data?.playing_movie.results[0] as IProgram}
          />

          <Slider
            title="현재 상영중인 영화"
            data={data?.playing_movie as IGetProgramResult}
            rowIndex={NOWPLAYING}
            onBoxClicked={onBoxClicked}
          />
          <Slider
            title="현재 인기있는 영화"
            data={data?.popular_movie as IGetProgramResult}
            rowIndex={POPULAR}
            onBoxClicked={onBoxClicked}
          />
          <Slider
            title="평가가 좋은 영화"
            data={data?.topRated_movie as IGetProgramResult}
            rowIndex={TOP_RATED}
            onBoxClicked={onBoxClicked}
          />
          <Slider
            title="개봉 예정 영화"
            data={data?.upComing_movie as IGetProgramResult}
            rowIndex={UPCOMING}
            onBoxClicked={onBoxClicked}
          />
          {/** BoxClicked in */}
          <AnimatePresence>
            {moviePathMatch ? (
              <Info
                programId={Number(moviePathMatch?.params.id)}
                rowIndex={rowIndex}
              />
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}
