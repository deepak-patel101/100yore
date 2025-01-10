import React, { useEffect, useState, useRef, useCallback } from "react";
import throttle from "lodash/throttle";
import "./Photo.css";
import Loading from "../Loading";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../Context/GlobalContextOne";

const PhotoGallery = () => {
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [depot, setDepot] = useState("SRDEE");
  const containerRef = useRef(null);
  const { depots } = useGlobalContext();
  const navigate = useNavigate();

  const fetchCategories = useCallback(async () => {
    if (loading || !hasMore) return; // Prevent redundant calls

    setLoading(true);
    try {
      const response = await fetch(
        `https://railwaymcq.com/railwaymcq/MCQTown/Fetch_Photo_Category.php?page=${page}&depot_name=${depot}`
      );
      const result = await response.json();

      if (result.success) {
        const newCategories = Object.entries(result.data);
        setCategories((prev) => [...prev, ...newCategories]);

        setPage((prev) => prev + 1);
        if (newCategories.length < 4) {
          setHasMore(false); // Stop fetching if fewer items are returned
        }
      } else {
        console.error(result.error);
        setHasMore(false); // Stop further requests on failure
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      setHasMore(false); // Stop further requests on error
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, depot]);

  const handleScroll = useCallback(
    throttle(() => {
      if (!hasMore || loading) return; // Stop if no more data or already loading

      const container = containerRef.current;
      if (
        container &&
        container.scrollHeight - container.scrollTop <=
          container.clientHeight + 100
      ) {
        fetchCategories();
      }
    }, 200),
    [hasMore, loading]
  );

  useEffect(() => {
    // Reset categories when depot changes
    setCategories([]);
    setPage(0);
    setHasMore(true);
    if (depot) {
      fetchCategories();
    }
  }, [depot]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll]);

  const handleClick = (category) => {
    navigate("/Gallery/PhotoGallery", {
      state: { category, depot },
    });
  };

  return (
    <div>
      <div className="row">
        <div className="col-md-8">
          <label>Depot:</label>
          <select
            className="form-select"
            onChange={(e) => setDepot(e.target.value)}
            value={depot}
          >
            <option value="">Select Depot</option>
            {depots?.map((depot) => (
              <option key={depot.depo_id} value={depot.depot_name}>
                {depot.depot_name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <label>Refresh:</label>
          <br />
          <button
            className="btn btn-outline-success"
            onClick={() => {
              setCategories([]);
              setPage(0);
              setHasMore(true);
              fetchCategories();
            }}
          >
            Refresh
          </button>
        </div>
      </div>
      <div
        ref={containerRef}
        className="scrollspy-example-2"
        style={{
          height: "90vh",
          overflowY: "scroll",
          overflowX: "hidden",
          padding: "10px",
        }}
      >
        <div className="row">
          {categories.map(([category, photos], index) => (
            <div
              key={index}
              className="col-12 col-md-6"
              style={{ position: "relative", cursor: "pointer" }}
              onClick={() => handleClick(category)}
            >
              <b>{category}</b>
              <div
                className={`d-flex justify-content-${
                  index % 4 < 2 ? "start" : "end"
                } m-2`}
              >
                <div className="gallery Subject papaDiv">
                  {photos.map((photo, idx) => (
                    <img key={idx} src={photo.Photo} alt={photo.Name} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        {loading && <Loading />}
        {!hasMore && (
          <div className="text-center">No more categories to load.</div>
        )}
      </div>
    </div>
  );
};

export default PhotoGallery;
