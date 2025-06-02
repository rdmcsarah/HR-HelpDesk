// This is a temporary file to fix the Navigation.tsx useEffect

useEffect(() => {
  if (mounted) {
    const s = data?.navMain.map((item) => {
      // Create a shallow copy to avoid mutating the original data
      const newItem = { ...item };
      newItem.isActive = newItem.url === pathName;

      if (newItem.items) {
        newItem.items = newItem.items.map((subItem) => {
          const isActive = subItem.url === pathName;
          if (isActive) {
            setActivePath({ ...subItem, parentTitle: newItem.title });
          }
          return {
            ...subItem,
            isActive,
          };
        });
      }

      return newItem;
    });

    setSideBarData({ navMain: s || [] });
  }
}, [pathName, mounted, data?.navMain]);
