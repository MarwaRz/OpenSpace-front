import Profile from "views/examples/Profile.js";
import Register from "views/examples/Register.js";
import Tables from "views/examples/Tables.js";
import UpdatePlateau from "views/examples/updatePlateau";

var routes = [
    {
        path: "/:plateauId/postes",
        component: <UpdatePlateau/>,
        layout: "/admin",
    },
    {
        path: "/plateaux",
        name: "Gestion des plateaux",
        icon: "ni ni-bullet-list-67 text-red",
        component: <Tables/>,
        layout: "/admin",
    },
    {
        path: "/segments",
        name: "Gestion des postes",
        icon: "ni ni-box-2 text-yellow",
        component: <Profile/>,
        layout: "/admin",
    },
    {
        path: "/login",
        name: "Deconnexion",
        icon: "ni ni-button-power text-pink",
        component: <Register/>,
        layout: "/auth",
    },
];
export default routes;
