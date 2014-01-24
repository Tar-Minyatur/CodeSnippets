<?php
include("RecursiveMenuEntry.class.php");

class RecursiveMenu {

    private $catalogs = array();
    private $products = array();

    private $catalogsByPID = array();
    private $productsByPID = array();

    public function __construct($catalogs, $catalogsByPID, $products, $productsByPID) {
        $this->catalogs      = $catalogs;
        $this->catalogsByPID = $catalogsByPID;
        
        $this->products      = $products;
        $this->productsByPID = $productsByPID;
    }
    
    public function assembleMenu ($rootNodeId = 0) {
        $menuEntry = new RecursiveMenuEntry($rootNodeId, "ROOT");
        $this->assembleMenuLevel($menuEntry);
        return $menuEntry;
    }
    
    private function assembleMenuLevel($parentEntry) {
    	$productCount = 0;
    	if (isset($this->productsByPID[$parentEntry->getId()])) {
    		$productCount = count($this->productsByPID[$parentEntry->getId()]);
    	}
        if (isset($this->catalogsByPID[$parentEntry->getId()]) &&
        	is_array($this->catalogsByPID[$parentEntry->getId()]) && 
        	(count($this->catalogsByPID[$parentEntry->getId()]) > 0)) {
        
            foreach ($this->catalogsByPID[$parentEntry->getId()] as $childId) {
                $childEntry = new RecursiveMenuEntry($childId, $this->catalogs[$childId]->name);
                $this->assembleMenuLevel($childEntry);
                $productCount += $childEntry->getProductCount();
                $parentEntry->addChild($childEntry);
            }
            
        }
        $parentEntry->setProductCount($productCount);
    }
}
