import { faBoltLightning, faListCheck, faQuestion, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { Card } from "flowbite-react";
import { useEffect, useState } from "react";
import { ChartLine } from "./User/ChartLine";
export default function Admin() {
  const [counts, setCounts] = useState({
    newActivity: { current: 0, effect: 0 },
    activity: { current: 0, effect: 0 },
    users: { current: 0, effect: 0 },
    faq: { current: 0, effect: 0 },
  });

  useEffect(() => {
    const getCount = async () => {
      try {
        const [response1, response2, response3, response4] = await Promise.all([
          axios.get("/activities/upcoming-activities/count"),
          axios.get("/activities/count"),
          axios.get("/user/count"),
          axios.get("/faq/count")
        ]);
        setCounts((prevCounts) => ({
          ...prevCounts,
          newActivity: { current: response1.data, effect: prevCounts.newActivity.effect },
          activity: { current: response2.data, effect: prevCounts.activity.effect },
          users: { current: response3.data, effect: prevCounts.users.effect },
          faq: { current: response4.data, effect: prevCounts.faq.effect },
        }));
      } catch (error) {
        console.log(error);
      }
    };
    getCount();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      Object.keys(counts).forEach((key) => {
        const count = counts[key];
        if (count.effect < count.current) {
          setCounts((prevCounts) => ({
            ...prevCounts,
            [key]: { ...count, effect: count.effect + 1 },
          }));
        }
      });
    }, 20);
    return () => clearInterval(interval);
  }, [counts]);
  return (
    <Card>
      {/*Container*/}
      <div className="container w-full mx-auto">
        <div className="w-full px-4 md:px-0 text-gray-800 leading-normal">
          {/*Console Content*/}
          <div className="flex flex-wrap">
            <div className="w-1/2 p-3">
              {/*Metric Card*/}
              <div className="bg-white border rounded shadow p-2">
                <div className="flex flex-row items-center">
                  <div className="flex-shrink pr-4">
                  <div className="rounded p-3 bg-blue-300">
                  <FontAwesomeIcon icon ={faUsers} style={{width:"20px"}}/>
                    </div>
                    
                  </div>
                  <div className="flex-1 text-right md:text-center">
                    <h5 className="font-bold uppercase text-gray-500">
                      Tổng người dùng
                    </h5>
                    <h3 className="font-bold text-3xl">
                    {counts.users.effect}
                      <span className="text-yellow-600">
                        <i className="fas fa-caret-up" />
                      </span>
                    </h3>
                  </div>
                </div>
              </div>
              {/*/Metric Card*/}
            </div>
            <div className="w-1/2 p-3">
              {/*Metric Card*/}
              <div className="bg-white border rounded shadow p-2">
                <div className="flex flex-row items-center">
                  <div className="flex-shrink pr-4">
                    <div className="rounded p-3 bg-green-300">
                    <FontAwesomeIcon icon ={faListCheck} style={{width:"20px"}}/>
                    </div>
                  </div>
                  <div className="flex-1 text-right md:text-center">
                    <h5 className="font-bold uppercase text-gray-500">
                      Tổng hoạt động
                    </h5>
                    <h3 className="font-bold text-3xl">{counts.activity.effect}</h3>
                  </div>
                </div>
              </div>
              {/*/Metric Card*/}
            </div>
            <div className="w-1/2 p-3">
              {/*Metric Card*/}
              <div className="bg-white border rounded shadow p-2">
                <div className="flex flex-row items-center">
                  <div className="flex-shrink pr-4">
                    <div className="rounded p-3 bg-yellow-300">
                    <FontAwesomeIcon icon ={faBoltLightning} style={{width:"20px"}}/>
                    </div>
                  </div>
                  <div className="flex-1 text-right md:text-center">
                    <h5 className="font-bold uppercase text-gray-500">
                      Hoạt động sắp diễn ra
                    </h5>
                    <h3 className="font-bold text-3xl">{counts.newActivity.effect}</h3>
                  </div>
                </div>
              </div>
              {/*/Metric Card*/}
            </div>
            <div className="w-1/2 p-3">
              {/*Metric Card*/}
              <div className="bg-white border rounded shadow p-2">
                <div className="flex flex-row items-center">
                  <div className="flex-shrink pr-4">
                    <div className="rounded p-3 bg-red-400">
                    <FontAwesomeIcon icon ={faQuestion} style={{width:"20px"}}/>
                    </div>
                  </div>
                  <div className="flex-1 text-right md:text-center">
                    <h5 className="font-bold uppercase text-gray-500">
                      Tổng câu hỏi
                    </h5>
                    <h3 className="font-bold text-3xl">
                    {counts.faq.effect}
                      <span className="text-red-500">
                        <i className="fas fa-caret-up" />
                      </span>
                    </h3>
                  </div>
                </div>
              </div>
              {/*/Metric Card*/}
            </div>
          </div>
          {/*Divider*/}
          <hr className="border-b-2 border-gray-400 my-8 mx-4" />
          <div className="flex flex-row flex-wrap flex-grow mt-2">
            <div className="w-full ">
              {/*Graph Card*/}
              <ChartLine/>
              {/*/Graph Card*/}
            </div>
          </div>
          {/*/table Card*/}
        </div>
      </div>
      {/*/ Console Content*/}
    </Card>
  );
}
