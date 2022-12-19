import { useQuery } from "react-query";
import { getTvShow, IGetProgramResult, IGetTvShow, IProgram } from "../api";
import styled from "styled-components";
import { Helmet } from "react-helmet-async";
import Banner from "../Components/Banner";
import Slider from "../Components/Slider";
import { useNavigate, PathMatch, useMatch } from "react-router-dom";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import TvInfo from "../Components/TvInfo";
import { Loader, Wrapper } from "./Home";

const TV = "tv";
const POPULAR = 0;
const TOP_RATED = 1;
const ONTEHAIR = 2;

export default function Tv() {
  const navigate = useNavigate();
  const moviePathMatch: PathMatch<string> | null = useMatch(`/${TV}/:id`);
  const { data, isLoading } = useQuery<IGetTvShow>(["tvShow"], getTvShow);
  const [rowIndex, setRowIndex] = useState<number | null>(null);
  const onBoxClicked = (tvId: number, rowIndex: number) => {
    setRowIndex(rowIndex);
    navigate(`/${TV}/${tvId}`);
  };
  return (
    <Wrapper>
      <Helmet>
        <title>시리즈 - 넷플릭스</title>
      </Helmet>
      {isLoading ? (
        <Loader>로딩 중...</Loader>
      ) : (
        <>
          {/** 체인소맨 배너 15번 해놓은것임 */}
          <Banner
            selected={TV}
            program={data?.popular_tv.results[0] as IProgram}
          />

          <Slider
            title="넷플릭스 인기 콘텐츠"
            data={data?.popular_tv as IGetProgramResult}
            rowIndex={POPULAR}
            onBoxClicked={onBoxClicked}
          />
          <Slider
            title="지금 뜨는 콘텐츠"
            data={data?.topRated_tv as IGetProgramResult}
            rowIndex={TOP_RATED}
            onBoxClicked={onBoxClicked}
          />
          <Slider
            title="지금 방영중인 콘텐츠"
            data={data?.onTheAir_tv as IGetProgramResult}
            rowIndex={ONTEHAIR}
            onBoxClicked={onBoxClicked}
          />
          {/** BoxClicked in */}
          <AnimatePresence>
            {moviePathMatch ? (
              <TvInfo
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
