import styled from "styled-components";
import { motion, useAnimation, useScroll } from "framer-motion";
import { Link, useMatch, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const Nav = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  position: fixed;
  width: 100%;
  top: 0;
  padding: 20px 3vw;
  background-image: linear-gradient(to top, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));

  @media screen and (max-width: 500px) {
    padding: 15px 3vw;
  }
`;
const Col = styled.div`
  display: flex;
  align-items: center;
`;
const Logo = styled(motion.svg)`
  margin-right: 50px;
  width: 95px;
  height: 25px;
  fill: ${(props) => props.theme.red};
  path {
    stroke: black;
    stroke-width: 1px;
  }

  @media screen and (max-width: 500px) {
    width: 4rem;
    margin-right: 30px;
  }
`;
const Items = styled.ul`
  display: flex;
  align-items: center;
`;
const Item = styled.li`
  margin-right: 20px;
  color: ${(props) => props.theme.white.darker};
  transition: color 0.3s ease-in-out;
  position: relative;
  display: flex;
  justify-content: center;
  flex-direction: column;
  &:hover {
    color: ${(props) => props.theme.white.lighter};
  }

  @media screen and (max-width: 500px) {
    font-size: 0.8em;
  }
`;

const Search = styled.form`
  display: flex;
  align-items: center;
  position: relative;
  svg {
    height: 22px;
    fill: currentColor;

    cursor: pointer;

    path {
      fill-rule: evenodd;
      clip-rule: evenodd;
    }
    @media screen and (max-width: 500px) {
      height: 1rem;
      position: relative;
    }
  }
`;

const SearchInput = styled(motion.input)`
  transform-origin: right;
  position: absolute;
  right: 0;
  padding: 5px 10px;
  padding-left: 40px;
  z-index: -1;
  color: white;
  font-size: 16px;
  background-color: transparent;
  border: 1px solid ${(props) => props.theme.white.lighter};

  :focus {
    border-color: gold;
    outline: none;
  }

  @media screen and (max-width: 500px) {
    padding: 3px 10px;
    padding-left: 20px;
    font-size: 1em;
  }
`;

const Circle = styled(motion.span)`
  position: absolute;
  width: 13px;
  height: 5px;
  border-radius: 5px;
  bottom: -5px;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: ${(props) => props.theme.white.lighter};

  @media screen and (max-width: 500px) {
    width: 0.8em;
  }
`;

const logoVariants = {
  normal: {
    fillOpacity: 1,
  },
  active: {
    fillOpacity: [0, 1, 0],
    transition: {
      repeat: Infinity,
    },
  },
};

const navVariants = {
  top: {
    backgroundColor: "rgba(0,0,0,0)",
  },
  scroll: {
    backgroundColor: "rgba(0,0,0,1)",
  },
};

interface IForm {
  keyword: string;
}

export default function Header() {
  const homeMatch = useMatch("/");
  const tvMatch = useMatch("/tv");
  const navAnimation = useAnimation();
  const { scrollY } = useScroll();
  const [searchOpen, setSearchOpen] = useState(false);
  const { register, handleSubmit, setFocus, setValue } = useForm<IForm>();
  const navigate = useNavigate();

  const clickSearch = () => {
    setSearchOpen(true);
    setFocus("keyword");
  };
  const closeSearch = () => {
    setSearchOpen(false);
  };
  const onVaild = (data: IForm) => {
    navigate(`/search?keyword=${data.keyword}`);
    setValue("keyword", "");
    // closeSearch();
  };
  useEffect(() => {
    scrollY.onChange(() => {
      if (scrollY.get() > 80) {
        navAnimation.start("scroll");
      } else {
        navAnimation.start("top");
      }
    });
  }, [scrollY]);
  return (
    <Nav variants={navVariants} initial={"top"} animate={navAnimation}>
      <Col>
        <Link to="/">
          <Logo
            variants={logoVariants}
            initial="normal"
            whileHover="active"
            animate="normal"
            xmlns="http://www.w3.org/2000/svg"
            width="1024"
            height="276.742"
            viewBox="0 0 1024 276.742"
          >
            <motion.path d="M140.803 258.904c-15.404 2.705-31.079 3.516-47.294 5.676l-49.458-144.856v151.073c-15.404 1.621-29.457 3.783-44.051 5.945v-276.742h41.08l56.212 157.021v-157.021h43.511v258.904zm85.131-157.558c16.757 0 42.431-.811 57.835-.811v43.24c-19.189 0-41.619 0-57.835.811v64.322c25.405-1.621 50.809-3.785 76.482-4.596v41.617l-119.724 9.461v-255.39h119.724v43.241h-76.482v58.105zm237.284-58.104h-44.862v198.908c-14.594 0-29.188 0-43.239.539v-199.447h-44.862v-43.242h132.965l-.002 43.242zm70.266 55.132h59.187v43.24h-59.187v98.104h-42.433v-239.718h120.808v43.241h-78.375v55.133zm148.641 103.507c24.594.539 49.456 2.434 73.51 3.783v42.701c-38.646-2.434-77.293-4.863-116.75-5.676v-242.689h43.24v201.881zm109.994 49.457c13.783.812 28.377 1.623 42.43 3.242v-254.58h-42.43v251.338zm231.881-251.338l-54.863 131.615 54.863 145.127c-16.217-2.162-32.432-5.135-48.648-7.838l-31.078-79.994-31.617 73.51c-15.678-2.705-30.812-3.516-46.484-5.678l55.672-126.75-50.269-129.992h46.482l28.377 72.699 30.27-72.699h47.295z" />
          </Logo>
        </Link>
        <Items>
          <Item>
            <Link to="/">홈 {homeMatch && <Circle layoutId="circle" />}</Link>
          </Item>
          <Item>
            <Link to="/tv">
              시리즈 {tvMatch && <Circle layoutId="circle" />}
            </Link>
          </Item>
        </Items>
      </Col>
      <Col>
        {/** onBlur={closeSearch} 포커스 나가면 실행 */}
        <Search onSubmit={handleSubmit(onVaild)}>
          <motion.svg
            onClick={searchOpen ? handleSubmit(onVaild) : clickSearch}
            animate={{ x: searchOpen ? -190 : 0 }}
            transition={{ type: "linear" }}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352c79.5 0 144-64.5 144-144s-64.5-144-144-144S64 128.5 64 208s64.5 144 144 144z" />
          </motion.svg>
          <SearchInput
            {...register("keyword", { required: true, minLength: 1 })}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: searchOpen ? 1 : 0 }}
            transition={{ type: "linear" }}
            type="text"
            placeholder="제목,사람,장르"
          ></SearchInput>
        </Search>
      </Col>
    </Nav>
  );
}
