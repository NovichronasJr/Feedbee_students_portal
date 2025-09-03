import * as React from "react";
import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import axios from "axios";
import { Chip, Avatar, Divider, Box } from "@mui/material";

export default function MediaCard({ item, mymap, Student_id }) {
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(true);
  let feedback_id = undefined;
  let student_id = undefined;

  useEffect(() => {
    async function fetchResponse(student_id, feedback_id) {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/response/${student_id}-${feedback_id}`);
        if (response.data.response.length !== 0) {
          setDone(true); // this means user has completed feedback
        }
        setLoading(false);
      } catch (error) {
        console.log(error.message);
        setLoading(false);
      }
    }

    if (mymap && feedback_id === undefined) {
      feedback_id = mymap.get(item.teacher._id);
      student_id = Student_id;
      fetchResponse(student_id, feedback_id);
    }
  }, [mymap, Student_id, item.teacher._id]);

  // Use the image from the teacher data or fallback to a default
  const imageUrl = item.teacher.image_url || "/static/default-profile.jpg";

  return (
    <Card
      sx={{
        width: 320,
        height: 380,
        backgroundColor: "#1e1e1e",
        color: "#e0e0e0",
        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.5)",
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        overflow: "hidden",
        border: "1px solid #333333",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 12px 28px rgba(0, 0, 0, 0.7)",
          borderColor: "#3b82f6",
        },
      }}
    >
      <Box sx={{ position: "relative" }}>
        <CardMedia
          sx={{ 
            height: 120,
            backgroundPosition: "center center",
            backgroundSize: "cover"
          }}
          image={imageUrl}
          title={item.teacher.name}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -20,
            left: 20,
            width: 60,
            height: 60,
            borderRadius: "50%",
            backgroundColor: "#1e1e1e",
            padding: "2px",
            border: "2px solid #2d2d2d",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <Avatar
            src={imageUrl}
            alt={item.teacher.name}
            sx={{ width: 56, height: 56 }}
          />
        </Box>
        <Chip
          label={item.subject}
          size="small"
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            backgroundColor: "rgba(59, 130, 246, 0.7)",
            color: "white",
            fontWeight: "500",
            backdropFilter: "blur(4px)",
            fontSize: "0.7rem",
          }}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 2, pt: 3 }}>
        <Typography 
          gutterBottom 
          variant="h6" 
          component="div" 
          sx={{ 
            fontWeight: 600,
            color: "#ffffff",
            mb: 1
          }}
        >
          {item.teacher.name}
        </Typography>
        
        <Typography 
          variant="body2" 
          sx={{ 
            color: "#9ca3af",
            display: "flex",
            alignItems: "center",
            fontSize: "0.85rem"
          }}
        >
          <Box component="span" sx={{ color: "#d1d5db", mr: 1 }}>Department:</Box> 
          Computer Science
        </Typography>
        
        <Divider sx={{ my: 2, backgroundColor: "#333333" }} />
        
        <Box 
          sx={{ 
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <Typography variant="caption" sx={{ color: "#6b7280", fontSize: "0.7rem" }}>
            ID: {item.teacher._id.substring(0, 8)}
          </Typography>
          
          <Chip 
            size="small"
            label={done ? "Completed" : "Pending"}
            sx={{
              backgroundColor: done ? "rgba(16, 185, 129, 0.2)" : "rgba(245, 158, 11, 0.2)",
              color: done ? "#10b981" : "#f59e0b",
              fontSize: "0.65rem",
              height: 20,
              "& .MuiChip-label": {
                px: 1,
              }
            }}
          />
        </Box>
      </CardContent>
      
      <CardActions sx={{ p: 2, pt: 0, justifyContent: "space-between" }}>
        <Link href={`/${item.teacher._id}`} passHref>
          <Button 
            variant="contained" 
            size="small" 
            sx={{ 
              backgroundColor: "#2563eb",
              color: "white",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#1d4ed8"
              }
            }}
          >
            Rate
          </Button>
        </Link>
        
        {mymap.get(item.teacher._id) ? (
          !done ? (
            <Link href={`/feedback/${mymap.get(item.teacher._id)}`} passHref>
              <Button 
                variant="outlined" 
                size="small" 
                sx={{ 
                  borderColor: "#65a30d",
                  color: "#65a30d",
                  textTransform: "none",
                  "&:hover": {
                    borderColor: "#4d7c0f",
                    backgroundColor: "rgba(101, 163, 13, 0.1)"
                  }
                }}
              >
                Take Feedback
              </Button>
            </Link>
          ) : (
            <Button 
              variant="outlined" 
              size="small" 
              sx={{
                borderColor: "#34d399",
                color: "#34d399",
                textTransform: "none",
                pointerEvents: "none"
              }}
              disabled
            >
              Completed
            </Button>
          )
        ) : null}
      </CardActions>
    </Card>
  );
}