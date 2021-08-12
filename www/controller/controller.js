

var crud = angular.module("crud", []);
var id = 0;
crud.controller("controller",function ($scope,$http){
  
    $scope.novaPessoa = {};
    $scope.pessoaSelecionada = {};
  
    $http({
      url: '/api/lista_emails/',
      method: "GET",
      data:{}
    })
    .then(function(response) {
      $scope.pessoas = response.data;
    },function(response){
      $scope.pessoas = [];
    });


    $scope.salvar = function(_id){                     
      if($scope.novaPessoa._id == null){
        console.log('é nulo');
        for( i in $scope.pessoas){
          console.log($scope.pessoas[i]['email'])
          if($scope.novaPessoa['email'] == $scope.pessoas[i]['email']){
            let timerInterval
            Swal.fire({
              title: ' Atualização não realizada!',
              html: 'Este e-mail ja consta em nossa base de dados',
              timer: 4000,
              timerProgressBar: true,
              didOpen: () => {
                Swal.showLoading()
                timerInterval = setInterval(() => {
                  const content = Swal.getHtmlContainer()
                  if (content) {
                    const b = content.querySelector('b')
                    if (b) {
                      b.textContent = Swal.getTimerLeft()
                    }
                  }
                }, 100)
              },
              willClose: () => {
                clearInterval(timerInterval)
              }
            })
            return
          }
          if($scope.novaPessoa['telefone'] == $scope.pessoas[i]['telefone']){
            let timerInterval
            Swal.fire({
              title: ' Atualização não realizada!',
              html: 'Este telefone ja consta em nossa base de dados',
              timer: 4000,
              timerProgressBar: true,
              didOpen: () => {
                Swal.showLoading()
                timerInterval = setInterval(() => {
                  const content = Swal.getHtmlContainer()
                  if (content) {
                    const b = content.querySelector('b')
                    if (b) {
                      b.textContent = Swal.getTimerLeft()
                    }
                  }
                }, 100)
              },
              willClose: () => {
                clearInterval(timerInterval)
              }
            })
            return
          }
        }
          $scope.pessoas.push($scope.novaPessoa);
          $http({
            url: '/api/lista_emails',
            method: "POST",
            data: { 'nome' : $scope.novaPessoa.nome , 'email': $scope.novaPessoa.email  , 'telefone': $scope.novaPessoa.telefone , 'senha': $scope.novaPessoa.senha},
            headers: {
              'Access-Control-Allow-Origin': '* , null',
              'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With'
            }
        })
        .then(function(response) {
                console.log("Novo registro inserido com sucesso.1");
                $scope.novaPessoa = {};
        }, 
        function(response) { 
                
        });

       }
       else{
           for (var i in $scope.pessoas){ 
                if($scope.pessoas[i]._id == $scope.novaPessoa._id){
                    $scope.pessoas[i] = $scope.novaPessoa;
                    $http({
                      url: '/api/lista_emails/'+ $scope.novaPessoa._id,
                      method: "PUT",
                      data: { 'nome' : $scope.novaPessoa.nome , 'email': $scope.novaPessoa.email ,'telefone' : $scope.novaPessoa.telefone , 'senha': $scope.novaPessoa.senha },
                  })
                  .then(function(response) {
                          console.log("Novo registro inserido com sucesso.");
                          $scope.novaPessoa = {};
                  }, 
                  function(response) { 
                  });
                }
           }
       }
    }
       




       $scope.EditarPessoa = function(id){
           for ( var i in $scope.pessoas){              // Chama para editar
               if($scope.pessoas[i]._id == id){
                  $scope.novaPessoa = angular.copy($scope.pessoas[i]);
                
                }
                
               
           }
          
       };

       $scope.ExcluirPessoa = function(id){
        for ( var i in $scope.pessoas){
            if($scope.pessoas[i]._id == id){
                
              $scope.pessoas.splice(i,1);
                $http({
                  url: '/api/lista_emails/'+id,
                  method: "DELETE"
                  
              })
              .then(function(response) {
                      console.log("E-mail excluído com sucesso.");
                      $scope.novaPessoa = {};
                      
              }, 
              function(response) { 
              });
               
            }
        }
       $scope.novaPessoa = {};
    };

    $scope.fechar = function(){
        $scope.novaPessoa = {};
    };

}
);
crud.directive('ngConfirmClick', [
    function(){
        return {
            link: function (scope, element, attr) {
                var msg = attr.ngConfirmClick || "Tem certeza que deseja excluir?";
                var clickAction = attr.confirmedClick;
                element.bind('click',function (event) {
                    Swal.fire({
                        title: 'Deseja mesmo excluir?',
                        text: "Após confirmar, não será possivel desfazer.",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Sim! Excluir!'
                      }).then((result) => {
                        if (result.isConfirmed) {
                          scope.$apply(clickAction)
                          Swal.fire(
                            'Excluido',
                            'O e-mail cadastrado foi excluído com sucesso.',
                            'success'
                          )
                        }
                      })
                   
                });
            }
        };
}])

