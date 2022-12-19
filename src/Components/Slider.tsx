import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { makeImagePath, useWindowDimensions } from "../utills";
import { IGetProgramResult } from "../api";

const SliderWrapper = styled(motion.div)`
  position: relative;
  top: -230px;
  margin-bottom: 12.5vw;
  :hover {
    button {
      opacity: 1;
    }
  }
  @media screen and (max-width: 500px) {
    margin-bottom: 13vw;
  }
`;

const SliderTitle = styled(motion.div)`
  margin-bottom: 10px;
  font-size: 1.5vw;
  font-weight: 400;
  padding: 0px 3vw;

  &:hover {
    filter: brightness(1.2);
  }
  @media screen and (max-width: 500px) {
    margin-bottom: 7px;
  }
`;

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  position: absolute;
  padding: 0px 3vw;

  width: 100%;
`;
const Box = styled(motion.div)<{ $bgPhoto: string }>`
  background-image: url(${(props) => props.$bgPhoto});
  background-size: cover;
  background-position: center center;
  height: 10vw;
  background-color: ${(props) => props.theme.black.veryDark};

  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const BoxInfo = styled(motion.div)`
  padding: 10px;
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-weight: 500;
    font-size: 1vw;
  }
`;

const NextBtn = styled(motion.button)`
  background-color: rgba(0, 0, 0, 0.3);
  height: 10vw;
  width: 3vw;
  position: absolute;
  right: 0;
  border-radius: 5px 0px 0px 5px;
  opacity: 0;

  cursor: pointer;

  :hover {
    filter: brightness(1.5);
  }
`;

const PrevBtn = styled(NextBtn)`
  border-radius: 0px 5px 5px 0px;
  left: 0;
`;

const rowVar = {
  center: {
    scale: 1,
    x: 0,
    transition: { duration: 1 },
  },
  entry: ({ next, width }: { next: boolean; width: number }) => {
    return {
      x: next ? width : -width,
    };
  },
  exit: ({ next, width }: { next: boolean; width: number }) => {
    return {
      x: next ? -width : width,
      transition: {
        duration: 1,
      },
    };
  },
};

const BoxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -30,
    transition: {
      delay: 0.5,
      duration: 0.4,
      type: "tween",
    },
  },
};

const infoVariants = {
  hover: {
    scale: 1,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.4,
      type: "tween",
    },
  },
};

const offset = 6;

interface ISliderProps {
  data: IGetProgramResult;
  title: string;
  rowIndex: number;
  onBoxClicked: (moiveId: number, rowIndex: number) => void;
}

export default function Slider({
  data,
  title,
  rowIndex,
  onBoxClicked,
}: ISliderProps) {
  const width = useWindowDimensions();
  const [index, setIndex] = useState<number[]>([0, 0, 0, 0]);
  const [leaving, setLeaving] = useState<Boolean>(false);
  const [next, setNext] = useState<Boolean>(true);
  const custom = { next, width };
  const changeIndex = (next: boolean, rowIndex: number) => {
    if (data) {
      if (leaving) return;
      setLeaving(true);
      setNext(next);
      const totalMovies = data?.results.length - 1; // 포스터용 하나 사용 -1
      const maxIndex = Math.floor(totalMovies / offset) - 1; //ceil올림 floor내림 , 페이지(index) 0에서 시작하기때문에 -1
      next
        ? setIndex((prev) => {
            const result = [...prev];
            result[rowIndex] === maxIndex
              ? (result[rowIndex] = 0)
              : (result[rowIndex] += 1);
            return result;
          })
        : setIndex((prev) => {
            const result = [...prev];
            result[rowIndex] === 0
              ? (result[rowIndex] = maxIndex)
              : (result[rowIndex] -= 1);
            return result;
          });
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);
  return (
    <SliderWrapper>
      <SliderTitle>{title}</SliderTitle>
      {/* initial={false} 시작시 no animation, onExitComplete={toggleLeaving} 중복 방지 */}
      <AnimatePresence
        initial={false}
        onExitComplete={toggleLeaving}
        custom={custom}
      >
        <Row
          custom={custom}
          key={index[rowIndex]}
          variants={rowVar}
          initial="entry"
          animate="center"
          exit="exit"
          transition={{ type: "tween", duration: 1 }}
        >
          {rowIndex === 0
            ? data?.results
                .slice(1)
                .slice(
                  offset * index[rowIndex],
                  offset * index[rowIndex] + offset
                )
                .map((program) => (
                  <Box
                    onClick={() => onBoxClicked(program.id, rowIndex)}
                    key={program.id}
                    variants={BoxVariants}
                    initial="normal"
                    whileHover="hover"
                    transition={{ type: "tween" }}
                    $bgPhoto={makeImagePath(program.backdrop_path)}
                    layoutId={String(rowIndex + "_" + program.id)}
                  >
                    <BoxInfo variants={infoVariants}>
                      <h4>{program.title || program.name}</h4>
                    </BoxInfo>
                  </Box>
                ))
            : data?.results
                .slice(
                  offset * index[rowIndex],
                  offset * index[rowIndex] + offset
                )
                .map((program) => (
                  <Box
                    onClick={() => onBoxClicked(program.id, rowIndex)}
                    key={program.id}
                    variants={BoxVariants}
                    initial="normal"
                    whileHover="hover"
                    transition={{ type: "tween" }}
                    $bgPhoto={makeImagePath(program.backdrop_path)}
                    layoutId={String(rowIndex + "_" + program.id)}
                  >
                    <BoxInfo variants={infoVariants}>
                      <h4>{program.title || program.name}</h4>
                    </BoxInfo>
                  </Box>
                ))}
        </Row>
        <PrevBtn key="perv" onClick={() => changeIndex(false, rowIndex)}>
          <svg
            style={{ fill: "white", width: "1.5vw" }}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
          >
            <path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 278.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" />
          </svg>
        </PrevBtn>
        <NextBtn key="next" onClick={() => changeIndex(true, rowIndex)}>
          <svg
            style={{ fill: "white", width: "1.5vw" }}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
          >
            <path d="M342.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L274.7 256 105.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
          </svg>
        </NextBtn>
      </AnimatePresence>
    </SliderWrapper>
  );
}
