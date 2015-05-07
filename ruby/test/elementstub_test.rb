require 'test/unit'
require '../lib/sahi'

class TC_MyTest < Test::Unit::TestCase
  # def setup
  # end

  # def teardown
  # end

  def test_to_s_single()
    assert_equal("_sahi._div(\"id\")", Sahi::ElementStub.new(nil, "div", ["id"]).to_s())
    assert_equal("_sahi._lastAlert()",  Sahi::ElementStub.new(nil, "lastAlert", []).to_s())
  end
  
  def test_to_s_multi_strings()
    assert_equal("_sahi._div(\"id\", \"id2\")", Sahi::ElementStub.new(nil, "div", ["id", "id2"]).to_s())
  end
  
  def test_to_s_multi_stubs()
    stub2 = Sahi::ElementStub.new(nil, "div", ["id2"])
    near = Sahi::ElementStub.new(nil, "near", [stub2])
    stub1 = Sahi::ElementStub.new(nil, "div", ["id1", near])
    assert_equal("_sahi._div(\"id1\", _sahi._near(_sahi._div(\"id2\")))", stub1.to_s())
  end
  
  def test_browser_multi_stubs()
	@b = Sahi::Browser.new("", "", "")
    assert_equal("_sahi._div(\"id\")", @b.div("id").to_s)
    assert_equal("_sahi._div(\"id\", \"id2\")", @b.div("id", "id2").to_s())
    assert_equal("_sahi._div(\"id1\", _sahi._near(_sahi._div(\"id2\")))", @b.div("id1").near(@b.div("id2")).to_s())
  end
  
  def test_xy()
	@b = Sahi::Browser.new("", "", "")
    assert_equal("_sahi._xy(_sahi._div(\"id\"), 10, 20)", @b.div("id").xy(10, 20).to_s)
  end  
  
  def test_under_no_extra_params()
	@b = Sahi::Browser.new("", "", "")
    assert_equal("_sahi._cell(0, _sahi._under(_sahi._cell(\"Heading\")))", @b.cell(0).under(@b.cell("Heading")).to_s)
  end 
  
  def test_right_of_no_extra_params()
	@b = Sahi::Browser.new("", "", "")
    assert_equal("_sahi._cell(0, _sahi._rightOf(_sahi._cell(\"Heading\")))", @b.cell(0).right_of(@b.cell("Heading")).to_s)
  end

  def test_left_of_no_extra_params()
	@b = Sahi::Browser.new("", "", "")
    assert_equal("_sahi._cell(0, _sahi._leftOf(_sahi._cell(\"Heading\")))", @b.cell(0).left_of(@b.cell("Heading")).to_s)
  end   
  
  def test_left_or_right_of_no_extra_params()
	@b = Sahi::Browser.new("", "", "")
    assert_equal("_sahi._cell(0, _sahi._leftOrRightOf(_sahi._cell(\"Heading\")))", @b.cell(0).left_or_right_of(@b.cell("Heading")).to_s)
  end 
  
  def test_above_no_extra_params()
	@b = Sahi::Browser.new("", "", "")
    assert_equal("_sahi._cell(0, _sahi._above(_sahi._cell(\"Heading\")))", @b.cell(0).above(@b.cell("Heading")).to_s)
  end  
  
  def test_above_or_under_no_extra_params()
	@b = Sahi::Browser.new("", "", "")
    assert_equal("_sahi._cell(0, _sahi._aboveOrUnder(_sahi._cell(\"Heading\")))", @b.cell(0).above_or_under(@b.cell("Heading")).to_s)
  end  
  
  def test_above_extra_params()
	@b = Sahi::Browser.new("", "", "")
    assert_equal("_sahi._cell(0, _sahi._above(_sahi._cell(\"Heading\"), [10,5], 20))", @b.cell(0).above(@b.cell("Heading"), [10,5], 20).to_s)
    assert_equal("_sahi._cell(0, _sahi._above(_sahi._cell(\"Heading\"), 10, 20))", @b.cell(0).above(@b.cell("Heading"), 10, 20).to_s)
    assert_equal("_sahi._cell(0, _sahi._above(_sahi._cell(\"Heading\"), 10, null))", @b.cell(0).above(@b.cell("Heading"), 10).to_s)
    assert_equal("_sahi._cell(0, _sahi._above(_sahi._cell(\"Heading\"), null, 20))", @b.cell(0).above(@b.cell("Heading"), nil, 20).to_s)
    assert_equal("_sahi._cell(0, _sahi._above(_sahi._cell(\"Heading\")))", @b.cell(0).above(@b.cell("Heading"), nil, nil).to_s)
  end
  
  def test_above_or_under_extra_params()
	@b = Sahi::Browser.new("", "", "")
    assert_equal("_sahi._cell(0, _sahi._aboveOrUnder(_sahi._cell(\"Heading\"), [10,5], 20))", @b.cell(0).above_or_under(@b.cell("Heading"), [10,5], 20).to_s)
    assert_equal("_sahi._cell(0, _sahi._aboveOrUnder(_sahi._cell(\"Heading\"), 10, 20))", @b.cell(0).above_or_under(@b.cell("Heading"), 10, 20).to_s)
    assert_equal("_sahi._cell(0, _sahi._aboveOrUnder(_sahi._cell(\"Heading\"), 10, null))", @b.cell(0).above_or_under(@b.cell("Heading"), 10).to_s)
    assert_equal("_sahi._cell(0, _sahi._aboveOrUnder(_sahi._cell(\"Heading\"), null, 20))", @b.cell(0).above_or_under(@b.cell("Heading"), nil, 20).to_s)
    assert_equal("_sahi._cell(0, _sahi._aboveOrUnder(_sahi._cell(\"Heading\")))", @b.cell(0).above_or_under(@b.cell("Heading"), nil, nil).to_s)
  end    
    
  def test_under_extra_params()
	@b = Sahi::Browser.new("", "", "")
    assert_equal("_sahi._cell(0, _sahi._under(_sahi._cell(\"Heading\"), [10,5], 20))", @b.cell(0).under(@b.cell("Heading"), [10,5], 20).to_s)
    assert_equal("_sahi._cell(0, _sahi._under(_sahi._cell(\"Heading\"), 10, 20))", @b.cell(0).under(@b.cell("Heading"), 10, 20).to_s)
    assert_equal("_sahi._cell(0, _sahi._under(_sahi._cell(\"Heading\"), 10, null))", @b.cell(0).under(@b.cell("Heading"), 10).to_s)
    assert_equal("_sahi._cell(0, _sahi._under(_sahi._cell(\"Heading\"), null, 20))", @b.cell(0).under(@b.cell("Heading"), nil, 20).to_s)
    assert_equal("_sahi._cell(0, _sahi._under(_sahi._cell(\"Heading\")))", @b.cell(0).under(@b.cell("Heading"), nil, nil).to_s)
  end
  
  def test_left_of_extra_params()
	@b = Sahi::Browser.new("", "", "")
    assert_equal("_sahi._cell(0, _sahi._leftOf(_sahi._cell(\"Heading\"), [10,5], 20))", @b.cell(0).left_of(@b.cell("Heading"), [10,5], 20).to_s)
    assert_equal("_sahi._cell(0, _sahi._leftOf(_sahi._cell(\"Heading\"), 10, 20))", @b.cell(0).left_of(@b.cell("Heading"), 10, 20).to_s)
    assert_equal("_sahi._cell(0, _sahi._leftOf(_sahi._cell(\"Heading\"), 10, null))", @b.cell(0).left_of(@b.cell("Heading"), 10).to_s)
    assert_equal("_sahi._cell(0, _sahi._leftOf(_sahi._cell(\"Heading\"), null, 20))", @b.cell(0).left_of(@b.cell("Heading"), nil, 20).to_s)
    assert_equal("_sahi._cell(0, _sahi._leftOf(_sahi._cell(\"Heading\")))", @b.cell(0).left_of(@b.cell("Heading"), nil, nil).to_s)
  end
  
  def test_right_of_extra_params()
	@b = Sahi::Browser.new("", "", "")
    assert_equal("_sahi._cell(0, _sahi._rightOf(_sahi._cell(\"Heading\"), [10,5], 20))", @b.cell(0).right_of(@b.cell("Heading"), [10,5], 20).to_s)
    assert_equal("_sahi._cell(0, _sahi._rightOf(_sahi._cell(\"Heading\"), 10, 20))", @b.cell(0).right_of(@b.cell("Heading"), 10, 20).to_s)
    assert_equal("_sahi._cell(0, _sahi._rightOf(_sahi._cell(\"Heading\"), 10, null))", @b.cell(0).right_of(@b.cell("Heading"), 10).to_s)
    assert_equal("_sahi._cell(0, _sahi._rightOf(_sahi._cell(\"Heading\"), null, 20))", @b.cell(0).right_of(@b.cell("Heading"), nil, 20).to_s)
    assert_equal("_sahi._cell(0, _sahi._rightOf(_sahi._cell(\"Heading\")))", @b.cell(0).right_of(@b.cell("Heading"), nil, nil).to_s)
  end

  def test_left_or_right_of_extra_params()
	@b = Sahi::Browser.new("", "", "")
    assert_equal("_sahi._cell(0, _sahi._leftOrRightOf(_sahi._cell(\"Heading\"), [10,5], 20))", @b.cell(0).left_or_right_of(@b.cell("Heading"), [10,5], 20).to_s)
    assert_equal("_sahi._cell(0, _sahi._leftOrRightOf(_sahi._cell(\"Heading\"), 10, 20))", @b.cell(0).left_or_right_of(@b.cell("Heading"), 10, 20).to_s)
    assert_equal("_sahi._cell(0, _sahi._leftOrRightOf(_sahi._cell(\"Heading\"), 10, null))", @b.cell(0).left_or_right_of(@b.cell("Heading"), 10).to_s)
    assert_equal("_sahi._cell(0, _sahi._leftOrRightOf(_sahi._cell(\"Heading\"), null, 20))", @b.cell(0).left_or_right_of(@b.cell("Heading"), nil, 20).to_s)
    assert_equal("_sahi._cell(0, _sahi._leftOrRightOf(_sahi._cell(\"Heading\")))", @b.cell(0).left_or_right_of(@b.cell("Heading"), nil, nil).to_s)
  end
  
end