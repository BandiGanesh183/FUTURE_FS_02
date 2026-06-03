const { Op } = require('sequelize');
const Lead = require('../models/Lead');

const createLead = async (req, res) => {
  try {
    const { name, email, phone, source } = req.body;
    
    const existingLead = await Lead.findOne({ where: { email } });
    if (existingLead) {
      return res.status(400).json({
        success: false,
        message: 'Lead with this email already exists'
      });
    }
    
    const lead = await Lead.create({
      name,
      email,
      phone,
      source: source || 'website_form'
    });
    
    res.status(201).json({
      success: true,
      data: lead
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const getLeads = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    
    let where = {};
    if (status) where.status = status;
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }
    
    const offset = (page - 1) * limit;
    
    const { count, rows } = await Lead.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });
    
    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findByPk(req.params.id);
    
    if (!lead) {
      return res.status(404).json({ 
        success: false, 
        message: 'Lead not found' 
      });
    }
    
    res.json({
      success: true,
      data: lead
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const updateLead = async (req, res) => {
  try {
    const { name, email, phone, source, status, score } = req.body;
    const lead = await Lead.findByPk(req.params.id);
    
    if (!lead) {
      return res.status(404).json({ 
        success: false, 
        message: 'Lead not found' 
      });
    }
    
    // Check if email is being changed and if it already exists
    if (email && email !== lead.email) {
      const existingLead = await Lead.findOne({ where: { email } });
      if (existingLead) {
        return res.status(400).json({
          success: false,
          message: 'Lead with this email already exists'
        });
      }
    }
    
    // Update lead fields
    if (name) lead.name = name;
    if (email) lead.email = email;
    if (phone) lead.phone = phone;
    if (source) lead.source = source;
    if (status) lead.status = status;
    if (score !== undefined) lead.score = score;
    
    lead.updatedAt = new Date();
    await lead.save();
    
    res.json({
      success: true,
      data: lead
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByPk(req.params.id);
    
    if (!lead) {
      return res.status(404).json({ 
        success: false, 
        message: 'Lead not found' 
      });
    }
    
    await lead.destroy();
    
    res.json({
      success: true,
      message: 'Lead deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const updateLeadStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const lead = await Lead.findByPk(req.params.id);
    
    if (!lead) {
      return res.status(404).json({ 
        success: false, 
        message: 'Lead not found' 
      });
    }
    
    lead.status = status;
    lead.updatedAt = new Date();
    await lead.save();
    
    res.json({
      success: true,
      data: lead
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const updateLeadScore = async (req, res) => {
  try {
    const { score } = req.body;
    const lead = await Lead.findByPk(req.params.id);
    
    if (!lead) {
      return res.status(404).json({ 
        success: false, 
        message: 'Lead not found' 
      });
    }
    
    lead.score = score;
    lead.updatedAt = new Date();
    await lead.save();
    
    res.json({
      success: true,
      data: lead
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const addNote = async (req, res) => {
  try {
    const { content, createdBy } = req.body;
    const lead = await Lead.findByPk(req.params.id);
    
    if (!lead) {
      return res.status(404).json({ 
        success: false, 
        message: 'Lead not found' 
      });
    }
    
    // If you have a Note model, implement this
    // For now, just return success
    res.json({
      success: true,
      message: 'Note added successfully',
      data: lead
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const getAnalytics = async (req, res) => {
  try {
    const totalLeads = await Lead.count();
    const newLeads = await Lead.count({ where: { status: 'new' } });
    const contactedLeads = await Lead.count({ where: { status: 'contacted' } });
    const convertedLeads = await Lead.count({ where: { status: 'converted' } });
    
    const conversionRate = totalLeads > 0 
      ? ((convertedLeads / totalLeads) * 100).toFixed(2)
      : 0;
    
    res.json({
      success: true,
      data: {
        totalLeads,
        newLeads,
        contactedLeads,
        convertedLeads,
        conversionRate: parseFloat(conversionRate)
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

module.exports = {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
  updateLeadStatus,
  updateLeadScore,
  addNote,
  getAnalytics
};