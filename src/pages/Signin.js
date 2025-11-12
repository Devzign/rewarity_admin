import React, { useState } from "react";
import { Button, Card, Form, Row, Col, Alert, Spinner } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { requestOtp, verifyOtp, getToken } from "../services/api";

export default function Signin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobile, setMobile] = useState("9999999999");
  const [code, setCode] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  async function handleSendOtp(e) {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);
    try {
      await requestOtp(mobile.trim());
      setStep(2);
      setInfo("OTP sent. For Admin, use 555444.");
    } catch (err) {
      setError(err?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(e) {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);
    try {
      const { token, user } = await verifyOtp(mobile.trim(), code.trim());
      if (!token) throw new Error("No token returned");
      setInfo(`Welcome ${user?.userName || ""}`);
      // Redirect back to originally requested path or profile
      const redirectTo = location.state?.from?.pathname || "/pages/profile";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  }

  // If already authenticated, push to profile (or dashboard) immediately
  React.useEffect(() => {
    const token = getToken();
    if (token) {
      const redirectTo = location.state?.from?.pathname || "/pages/profile";
      navigate(redirectTo, { replace: true });
    }
  }, [location.state, navigate]);

  return (
    <div className="page-sign">
      <Card className="card-sign">
        <Card.Header>
          <Link to="/" className="header-logo mb-4">Rewarity</Link>
          <Card.Title>Admin Login</Card.Title>
          <Card.Text>Sign in with your mobile number</Card.Text>
        </Card.Header>
        <Card.Body>
          {error ? <Alert variant="danger" className="mb-3">{error}</Alert> : null}
          {info ? <Alert variant="success" className="mb-3">{info}</Alert> : null}

          {step === 1 && (
            <Form onSubmit={handleSendOtp}>
              <div className="mb-4">
                <Form.Label>Mobile</Form.Label>
                <Form.Control
                  type="tel"
                  inputMode="numeric"
                  placeholder="Enter your mobile number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />
                <div className="form-text">Seeded Admin mobile: 9999999999</div>
              </div>
              <Button type="submit" variant="primary" className="btn-sign" disabled={loading}>
                {loading ? <Spinner size="sm" animation="border" /> : "Send OTP"}
              </Button>
            </Form>
          )}

          {step === 2 && (
            <Form onSubmit={handleVerify}>
              <Row className="g-2">
                <Col sm={7}>
                  <Form.Label>Enter OTP</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g. 555444"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                  <div className="form-text">For Admin, OTP is always 555444</div>
                </Col>
                <Col sm={5} className="d-flex align-items-end">
                  <Button type="submit" variant="success" className="w-100" disabled={loading || !code}>
                    {loading ? <Spinner size="sm" animation="border" /> : "Verify & Login"}
                  </Button>
                </Col>
              </Row>
              <div className="mt-3">
                <Button variant="link" onClick={() => setStep(1)}>Change number</Button>
              </div>
            </Form>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}
