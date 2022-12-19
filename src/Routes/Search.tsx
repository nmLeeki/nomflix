import { useQuery } from "react-query";
import {
  PathMatch,
  useLocation,
  useMatch,
  useNavigate,
} from "react-router-dom";
import { getSearchData, IGetSearchData } from "../api";
import styled from "styled-components";
import queryString from "query-string";
import { Loader, Wrapper } from "./Home";
import { Helmet } from "react-helmet-async";
import { AnimatePresence, motion } from "framer-motion";
import { makeImagePath } from "../utills";
import { useState } from "react";
import Info from "../Components/Info";
import TvInfo from "../Components/TvInfo";

const SearchProgramsContainer = styled.div`
  width: 100%;
  padding: 70px 3vw;
`;

const SearchProgramsTitle = styled.h2`
  font-weight: 500;
  font-size: 24px;
  margin-bottom: 20px;
`;
const SearchPrograms = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, auto));
  gap: 50px;
`;
const SearchProgramContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  flex-direction: column;

  cursor: pointer;
  &:hover {
    h4 {
      color: ${(props) => props.theme.white.lighter};
      font-weight: 400;
    }
  }
`;

const SearchProgramImg = styled.img`
  border-radius: 15px;
  width: 100%;
  height: 100%;
  margin-bottom: 10px;

  box-shadow: 3px 3px 5px rgba(255, 255, 255, 0.1);
  background-color: ${(props) => props.theme.black.veryDark};
  display: flex;
  align-items: center;
  justify-content: center;
  span {
    color: ${(props) => props.theme.white.lighter};
  }
`;

const SearchProgramTitle = styled.h4`
  font-size: 18px;
  font-weight: 300;
  color: ${(props) => props.theme.white.darker};
`;

const programVar = {
  normal: { scale: 1 },
  hover: { scale: 1.1, transition: { duration: 0.8, type: "spring" } },
};

export default function Search() {
  const location = useLocation();
  const navigate = useNavigate();
  const { keyword, id } = queryString.parse(location.search);
  const [type, setType] = useState("");
  const { data, isLoading } = useQuery<IGetSearchData>(
    ["search", keyword],
    () => getSearchData(keyword + "")
  );
  const onBoxClicked = (programId: number, type: string) => {
    setType(type);
    navigate(`/search?keyword=${keyword}&type=${type}&id=${programId}`);
  };
  return (
    <Wrapper>
      <Helmet>
        <title>{keyword} - 넷플릭스</title>
      </Helmet>
      {isLoading ? (
        <Loader>로딩 중...</Loader>
      ) : (
        <>
          <SearchProgramsContainer>
            <SearchProgramsTitle>
              {keyword}에 대한 영화 검색 결과
            </SearchProgramsTitle>
            <SearchPrograms>
              {data?.search_movies.results.map((movie) => (
                <SearchProgramContainer
                  key={movie.id}
                  layoutId={"movie_" + movie.id}
                  variants={programVar}
                  initial="normal"
                  whileHover="hover"
                  onClick={() => onBoxClicked(movie.id, "movie")}
                >
                  {movie.backdrop_path ? (
                    <SearchProgramImg
                      src={makeImagePath(movie.backdrop_path, "w500")}
                    />
                  ) : (
                    <SearchProgramImg as="div">
                      <span>이미지 없음</span>
                    </SearchProgramImg>
                  )}

                  <SearchProgramTitle>{movie.title}</SearchProgramTitle>
                </SearchProgramContainer>
              ))}
            </SearchPrograms>
          </SearchProgramsContainer>
          <SearchProgramsContainer>
            <SearchProgramsTitle>
              {keyword}에 대한 TV 검색 결과
            </SearchProgramsTitle>
            <SearchPrograms>
              {data?.search_tvShow.results.map((tv) => (
                <SearchProgramContainer
                  key={tv.id}
                  layoutId={"tv_" + tv.id}
                  variants={programVar}
                  initial="normal"
                  whileHover="hover"
                  onClick={() => onBoxClicked(tv.id, "tv")}
                >
                  {tv.backdrop_path ? (
                    <SearchProgramImg
                      src={makeImagePath(tv.backdrop_path, "w500")}
                    />
                  ) : (
                    <SearchProgramImg as="div">
                      <span>이미지 없음</span>
                    </SearchProgramImg>
                  )}

                  <SearchProgramTitle>{tv.name}</SearchProgramTitle>
                </SearchProgramContainer>
              ))}
            </SearchPrograms>
          </SearchProgramsContainer>
          <AnimatePresence>
            {!id ? null : type === "movie" ? (
              <Info
                programId={Number(id)}
                rowIndex={type}
                search={keyword + ""}
              />
            ) : type === "tv" ? (
              <TvInfo
                programId={Number(id)}
                rowIndex={type}
                search={keyword + ""}
              />
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}
