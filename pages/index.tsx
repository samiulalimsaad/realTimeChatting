import { Button, Grid, Typography } from "@material-ui/core";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Chatting from "../chatting";
import Preview from "../chatting/preview";
import { auth } from "../Firebase";
import UserList from "../Users/UserList";

export default function Home() {
    const [authenticate, setAuthenticate] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [conversationName, setConversationName] = useState({
        message: "",
        name: "",
    });
    const router = useRouter();
    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                setUser(user.email);
                setAuthenticate(true);
            } else {
                setUser(null);
                setAuthenticate(false);
            }
            setLoading(false);
        });
    });

    const logout = () => {
        auth.signOut().then((res) => {
            setUser(null);
            setAuthenticate(false);
        });
    };

    if (loading) {
        return (
            <div style={{ display: "grid", placeItems: "center",height:'100vh' }}>
                <h1>Loading....</h1>
            </div>
        );
    }
    if (!authenticate) {
        router.replace("/login");
        return null;
    }
    return (
        <div>
            <Head>
                <title>Real time Chatting App</title>
                <meta
                    name="description"
                    content="Generated by create next app"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                <Grid container justify="center">
                    <Grid item xs={12} md={4}>
                        <UserList setConversationName={setConversationName} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        {conversationName.name ? (
                            <Chatting conversationName={conversationName} />
                        ) : (
                            <Preview />
                        )}
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <div
                            style={{
                                height: "95vh",
                                overflowY: "auto",
                                position: "relative",
                                padding:'0 1rem'
                            }}
                        >
                            <Typography variant="h4" paragraph>
                                logged in as {user}
                            </Typography>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={logout}
                            >
                                Logout
                            </Button>
                            <a
                                href="https://portfolio-saadraj.vercel.app/"
                                target="_blank"
                                style={{
                                    bottom: 0,
                                    paddingBottom: "10px",
                                    position: "absolute",
                                }}
                            >
                                https://portfolio-saadraj.vercel.app/
                            </a>
                        </div>
                    </Grid>
                </Grid>
            </main>
        </div>
    );
}
