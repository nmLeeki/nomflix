import styled from "styled-components";
import { IProgram } from "../api";
import { makeImagePath } from "../utills";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const HomeBanner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 3vw;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center;
`;

const BannerItems = styled.div`
  @media screen and (max-width: 500px) {
    font-size: 10px;
  }
`;

const Title = styled.h2`
  font-size: 4.5vw;
  max-width: 50vw;
  margin-bottom: 20px;

  @media screen and (max-width: 500px) {
    margin-bottom: 0.5em;
  }
`;
const Overview = styled.div`
  font-size: 1.4vw;
  max-width: 40vw;
  margin-bottom: 20px;

  @media screen and (max-width: 500px) {
    font-size: 1.2em;
    margin-bottom: 10px;
    max-width: 70vw;
  }
`;
const BannerBtnRow = styled.div`
  display: flex;
  gap: 1vw;
`;
const RunBtn = styled.button`
  background-color: ${(props) => props.theme.white.lighter};
  color: ${(props) => props.theme.black.darker};
  border-radius: 5px;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1vw;
  width: 9vw;
  height: 3vw;

  cursor: pointer;
  &:hover {
    filter: brightness(0.8);
  }
  span {
    font-size: 1.2vw;
  }

  @media screen and (max-width: 500px) {
    width: 10vw;
    height: 5vw;
  }
`;
const InfoBtn = styled(motion(RunBtn))`
  background-color: ${(props) => props.theme.black.lighter};
  color: ${(props) => props.theme.white.lighter};
  width: 11vw;

  &:hover {
    filter: brightness(1.2);
  }
  span {
    font-size: 1.2vw;
  }

  @media screen and (max-width: 500px) {
    width: 13vw;
    height: 5vw;
  }
`;
// 하나에 두개 타입 해서 하나로쓰기 / 두개의 프롭이 가능하지만 ? 안받아도되게해서 각각 사용
export default function Banner({
  selected,
  program,
}: {
  selected: string;
  program: IProgram;
}) {
  const navigate = useNavigate();
  const onBoxClicked = (programId: number) => {
    navigate(`/${selected}/${programId}`);
  };
  return (
    <HomeBanner bgPhoto={makeImagePath(program.backdrop_path || "")}>
      <BannerItems>
        <Title>{program.name || program.title} </Title>
        <Overview>{program.overview}</Overview>
        <BannerBtnRow>
          <RunBtn>
            <svg
              style={{ width: "20%" }}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 384 512"
            >
              <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z" />
            </svg>
            <span>재생</span>
          </RunBtn>
          <InfoBtn
            onClick={() => onBoxClicked(Number(program.id))}
            layoutId={program.id}
          >
            <svg
              style={{ width: "20%" }}
              fill="white"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-144c-17.7 0-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32s-14.3 32-32 32z" />
            </svg>
            <span>상세 정보</span>
          </InfoBtn>
        </BannerBtnRow>
      </BannerItems>
    </HomeBanner>
  );
}
