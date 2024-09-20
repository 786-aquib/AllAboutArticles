// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SignUp from './components/SignUp';                            
import SignIn from './components/SignIn';
import Home from './components/Profile';
import ArticlesList from './components/ArticleList';
import ArticleCardWrapper from './components/ArticleCardWrapper';
import Profile from './components/Profile';
import AllArticleData from './components/AllArticleData';
import './styles/global.css'
import Wishlisted from './components/Wishlisted';
import ProfileDetail from './components/ProfileDetail';
import AddNewArticle from './components/AddNewArticle';
import My_Profile from './components/My_Profile';


const App: React.FC = () => {       
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/signup" replace />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/home" element={<Home />} />
        <Route path="/Profile" element={<My_Profile />} />
        <Route path="/articles" element={<ArticlesList />} />
        <Route path="/article-card" element={<ArticleCardWrapper />} />
        <Route path = '/AllArticleData/:slug' element = {<AllArticleData/>} />
        <Route path = '/Wishlisted' element = {<Wishlisted/>} />
        <Route path = '/ProfileDetail/:username' element = {<ProfileDetail/>} />
        <Route path = '/AddNewArticle' element = {<AddNewArticle/>} />

      </Routes>
    </Router>
  );                 
};

export default App;
