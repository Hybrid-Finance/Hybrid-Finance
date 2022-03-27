import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Card, CardActions, Typography, Grid, CardMedia } from "@material-ui/core";
import "./home.scss";

function Home() {
    return (
        <div className="front-page">
            <Container maxWidth="md">
                <Card className="info-card">
                    <h2 className="text-light text-center">Announcing Pre Sale of $HyFi</h2>
                    <div className="card-text" style={{ padding: "10px 40px" }}>
                        <p className="text-light info-card-text text-center">
                            The presale will be done in 2 tiers followed by first-come-first-serve (fcfs) sale of remaining tokens.
                        </p>
                        <p className="text-light info-card-text text-center">Tier 1 - 26 Mar 1700 UTC to 27 Mar 1700 UTC. Only whitelisted. Max 1500 tokens. 1 $HyFi = $0.8.</p>
                        <p className="text-light info-card-text text-center">Tier 2 - 27 Mar 1700 UTC to 28 Mar 1700 UTC. Only whitelisted. Max 1300 tokens. 1 $HyFi = $0.9.</p>
                        <p className="text-light info-card-text text-center">FCFS - 28 Mar 1700 UTC to 29 Mar 1700 UTC. Open to all. No token limit. 1 $HyFi = $1.</p>
                        <p className="text-light info-card-text text-center">
                            On launch, all $HyFi tokens will be 1:1 convertible to $HYBRID tokens. The auto-compounding for $HYBRID will start 24 hours after launch, giving ample
                            time for everyone to convert to $HYBRID.
                        </p>
                    </div>
                    <CardActions style={{ justifyContent: "center", marginTop: "20px", marginBottom: "20px" }}>
                        <Button variant="contained" href="#presale" size="large" style={{ borderRadius: "10px", backgroundColor: "#ffffff" }} className="text-normal-font">
                            Go to presale
                        </Button>
                    </CardActions>
                </Card>
            </Container>
        </div>
    );
}

export default Home;
