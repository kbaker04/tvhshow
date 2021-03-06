import axios from "axios";
import parse from "html-react-parser";
import Cast from "../../components/cast";
import Error from "next/error";
///import CustomError from "../_error";

const ShowDetails = ({ show = {}, statusCode }) => {
  const { name, image, summary, _embedded } = show;

  if (statusCode) {
    return <Error statusCode={statusCode} title="There was a problem" />;
  }

  return (
    <div className="show-deals">
      <div
        className="show-details__poster"
        style={{ backgroundImage: `url(${image.original})` }}
      ></div>
      <h1>{name}</h1>
      {parse(summary)}

      {_embedded.cast.length > 0 && <Cast cast={_embedded.cast} />}
      <style jsx>
        {`
          .show-details__poster {
            height: 200px;
            background-size: cover;
          }
        `}
      </style>
    </div>
  );
};

export const getServerSideProps = async ({ query }) => {
  const { showId } = query;

  try {
    const response = await axios.get(
      `https://api.tvmaze.com/shows/${showId}?embed=cast`
    );

    return {
      props: {
        show: response.data,
      },
    };
  } catch (error) {
    return {
      props: {
        statusCode: error.response ? error.response.status : 500,
      },
    };
  }
};

export default ShowDetails;
