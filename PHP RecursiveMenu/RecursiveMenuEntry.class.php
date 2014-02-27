<?php
class RecursiveMenuEntry {

    private $id;
    private $name;
    private $productCount;
    private $children;
    
    public function __construct($id, $name, $productCount = 0) {
        $this->id = $id;
        $this->name = $name;
        $this->productCount = $productCount;
        $this->children = array();
    }
    
    public function setProductCount($productCount) {
        $this->productCount = $productCount;
    }
    
    public function getId() {
        return $this->id;
    }

    public function getName() {
        return $this->name;
    }
    
    public function getProductCount() {
        return $this->productCount;
    }
    
    public function getChildren() {
        return $this->children;
    }    
    
    public function addChild (RecursiveMenuEntry $entry) {
        array_push($this->children, $entry);
    }
    
    public function render () {
    	$output = '<ul>';
    	if (count($this->children) > 0) {
            foreach ($this->children as $child) {
                $output .= $child->renderRecursively(0);
            }
        }
        $output .= '</ul>';
        return $output;
    }
    
    /**
     * @todo add a switch for the applied if, that catalogs with 0 entries aren't displayed
     */
    private function renderRecursively ($level) {
        $output = "";
        if($this->productCount > 0)
        {
            $output = '<li class="level_'.$level.'">' . $this->name . ' (' . $this->productCount . ')';
    	    if (count($this->children) > 0) {
    	        $nextLevel = $level + 1;
    	        $output .= '<ul class="level_'.$nextLevel.'">';
                foreach ($this->children as $child) {
                    $output .= $child->renderRecursively($nextLevel);
                }
                $output .= '</ul>';
            }
        
            $output .= '</li>';
        }
        return $output;   
    }

}
