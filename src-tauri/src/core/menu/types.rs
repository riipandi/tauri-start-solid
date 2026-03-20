use std::fmt::{Display, Formatter};

/// Represents a menu item type
#[derive(Debug, Clone, PartialEq)]
pub enum MenuItemType {
    /// Regular menu item with a callback
    Regular,
    /// Menu item that acts as a separator
    Separator,
    /// Submenu containing other menu items
    Submenu,
    /// Predefined menu item (like Copy, Paste, etc.)
    Predefined(PredefinedType),
}

/// Predefined menu item types provided by Tauri
#[derive(Debug, Clone, PartialEq)]
pub enum PredefinedType {
    Undo,
    Redo,
    Cut,
    Copy,
    Paste,
    SelectAll,
    Quit,
    Hide,
    HideOthers,
    ShowAll,
    Minimize,
    Fullscreen,
}

impl Display for PredefinedType {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        match self {
            PredefinedType::Undo => write!(f, "undo"),
            PredefinedType::Redo => write!(f, "redo"),
            PredefinedType::Cut => write!(f, "cut"),
            PredefinedType::Copy => write!(f, "copy"),
            PredefinedType::Paste => write!(f, "paste"),
            PredefinedType::SelectAll => write!(f, "selectAll"),
            PredefinedType::Quit => write!(f, "quit"),
            PredefinedType::Hide => write!(f, "hide"),
            PredefinedType::HideOthers => write!(f, "hideOthers"),
            PredefinedType::ShowAll => write!(f, "showAll"),
            PredefinedType::Minimize => write!(f, "minimize"),
            PredefinedType::Fullscreen => write!(f, "fullscreen"),
        }
    }
}

/// Represents a menu item with all its properties
#[derive(Debug, Clone)]
pub struct MenuItem {
    /// Unique identifier for the menu item
    pub id: String,
    /// Display text for the menu item
    pub label: String,
    /// Keyboard shortcut for the menu item (optional)
    pub accelerator: Option<String>,
    /// Whether the menu item is enabled
    pub enabled: bool,
    /// Type of menu item
    pub item_type: MenuItemType,
    /// Child items for submenu type
    pub children: Vec<MenuItem>,
}

impl MenuItem {
    /// Create a new regular menu item
    pub fn new<S: Into<String>>(id: S, label: S) -> Self {
        MenuItem {
            id: id.into(),
            label: label.into(),
            accelerator: None,
            enabled: true,
            item_type: MenuItemType::Regular,
            children: Vec::new(),
        }
    }

    /// Create a separator menu item
    pub fn separator() -> Self {
        MenuItem {
            id: String::new(),
            label: String::new(),
            accelerator: None,
            enabled: true,
            item_type: MenuItemType::Separator,
            children: Vec::new(),
        }
    }

    /// Create a predefined menu item
    pub fn predefined(predefined_type: PredefinedType, label: Option<String>) -> Self {
        MenuItem {
            id: format!("predefined-{}", predefined_type),
            label: label.unwrap_or_else(|| format!("{}", predefined_type)),
            accelerator: None,
            enabled: true,
            item_type: MenuItemType::Predefined(predefined_type),
            children: Vec::new(),
        }
    }

    /// Create a submenu
    pub fn submenu<S: Into<String>>(label: S, children: Vec<MenuItem>) -> Self {
        let label_string = label.into();
        MenuItem {
            id: format!("submenu-{}", label_string),
            label: label_string,
            accelerator: None,
            enabled: true,
            item_type: MenuItemType::Submenu,
            children,
        }
    }

    /// Set keyboard shortcut
    pub fn with_accelerator<S: Into<String>>(mut self, accelerator: S) -> Self {
        self.accelerator = Some(accelerator.into());
        self
    }

    /// Set enabled state
    pub fn with_enabled(mut self, enabled: bool) -> Self {
        self.enabled = enabled;
        self
    }

    /// Set custom id
    pub fn with_id<S: Into<String>>(mut self, id: S) -> Self {
        self.id = id.into();
        self
    }
}
