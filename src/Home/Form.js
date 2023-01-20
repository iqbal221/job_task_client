import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import Swal from "sweetalert2";

const Form = () => {
  const [information, setInformation] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // data receive from database
  useEffect(() => {
    fetch("http://localhost:5000/info")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setInformation(data);
      });
  }, []);

  // delete daily dask from database
  const deleteInformation = (id) => {
    Swal.fire({
      title: "Do you want to delete confirm?",
      showCancelButton: true,
      confirmButtonText: "Ok",
    }).then((result) => {
      if (result.isConfirmed) {
      } else if (result.isDenied) {
      }
      console.log(id);
      fetch(`http://localhost:5000/info/${id}`, {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data.acknowledged) {
            toast.success("Delete Info Successfully");
          }
          const remainingInformation = information.filter(
            (info) => info._id !== id
          );
          setInformation(remainingInformation);
        });
    });
  };

  const handleInfo = (event) => {
    event.preventDefault();
    const form = event.target;
    const Info = form.Info.value;
    console.log(Info);

    const formInfo = {
      Info: Info,
    };
    // form data save to server
    fetch("http://localhost:5000/info", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(formInfo),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.acknowledged) {
          toast.success("Data Save Successfully");
        }
        window.location.href = "http://localhost:3000";
      });
  };

  return (
    <>
      <div className="hero pt-14 bg-base-200">
        <div className="hero-content w-2/5 flex-col">
          <div className="card  w-full shadow-xl bg-base-100">
            <form onSubmit={handleInfo} className="card-body">
              <div className="form-control">
                <input
                  type="text"
                  name="Info"
                  placeholder="Write Something Here"
                  className="input input-bordered"
                />
              </div>

              <div className="form-control mt-6">
                <button className="btn btn-primary">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="hero pt-10 pb-24 bg-base-200">
        <div className="hero-content w-2/5 flex-col">
          <div className="card  w-full shadow-xl bg-base-100">
            <table className="table w-full text-xl">
              <thead></thead>
              <tbody>
                <tr className="text-xl font-bold text-warning">
                  <th>SL</th>
                  <th>INFORMATION</th>
                  <th>ACTION</th>
                </tr>
                {information.map((info, i) => (
                  <tr className="text-lg">
                    <th>{i + 1}</th>
                    <td>{info.Info}</td>
                    <td>
                      <button
                        onClick={() => deleteInformation(info._id)}
                        className="btn btn-error"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Form;
