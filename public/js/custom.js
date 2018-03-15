$(function() {
  $('#search').keyup(function() {
    const search_term = $(this).val();

    $.ajax({
      method: 'POST',
      url: '/api/search',
      data: {
        search_term
      },
      dataType: 'json',
      success: function(json) {
        console.log('res', json);
        
        let data = json.hits.hits.map(function(hit){
          return hit;
        });

        $('#searchResults').empty();
        for(let i = 0; i < data.length; i++) {
          let html = '';
          html += '<div class="col-md-4>';
          html += '<a href="/product/' + data[i]._source._id + '">';
          html += '<div class="thumbnail">';
          html += '<img src="' +  data[i]._source.image + '">';
          html += '<div class="caption">';
          html += '<h3>' + data[i]._source.name  + '</h3>';
          html += '<p>' +  data[i]._source.category.name  + '</h3>'
          html += '<p>$' +  data[i]._source.price  + '</p>';
          html += '</div></div></a></div>';

          $('#searchResults').append(html);
          
        }
      },
      error: function(err) {
        console.log(err);     
      }
    });
  });


  $(document).on('click', '#plus', (e) => {
    e.preventDefault();
    //get previous
    let priceValue = parseFloat($('#priceValue').val());
    let quantity = parseInt($('#quantity').val());
    //increment
    priceValue += parseFloat($('#priceHidden').val());
    quantity += 1;
    //update the DOM
    $('#quantity').val(quantity);
    $('#priceValue').val(priceValue.toFixed(2));
    $('#total').html(quantity);
  });

  $(document).on('click', '#minus', (e) => {
    e.preventDefault();
    //get previous
    let priceValue = parseFloat($('#priceValue').val());
    let quantity = parseInt($('#quantity').val());
    //decrement
    if(quantity == 1) {
      priceValue = parseFloat($('#priceHidden').val());
      quantity = 1;
    } else {
      priceValue -= parseFloat($('#priceHidden').val());
      quantity -= 1;
    }
    //update the DOM
    $('#quantity').val(quantity);
    $('#priceValue').val(priceValue.toFixed(2));
    $('#total').html(quantity);
  });


});