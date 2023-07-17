export default class View
{
    constructor(element, width, height, rows, columns)
    {
        this.element = element;
        this.width = width;
        this.height = height;
        this.canvas = document.createElement('canvas'); //создание холста
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.ctx = this.canvas.getContext('2d'); //доступ к 2д фигурам и графике
        //this.name

        this.field_border_width = 4; //ширина границы игрового поля
        this.field_x = this.field_border_width; //координаты верхнего левого угла поля
        this.field_y = this.field_border_width;
        this.field_width = this.width * 1/2;// 2/3 поля будет 2/3 от общей
        this.field_height = this.height;
        this.field_inner_width = this.field_width - this.field_border_width*2; //внутрення чатсь поля
        this.field_inner_height = this.field_height - this.field_border_width;

        //this.rows = rows;
        //this.columns = columns;

        this.cell_width = this.field_inner_width / columns; //ширина одной клетки на поле(в пикселях)
        this.cell_height = this.field_inner_height / rows; //высота одной клетки на поле(в пикселях)

        this.panel_x = this.field_width + 10; //кординаты панели
        this.panel_y = 0;
        //this.panel_width = this.width * 1/2;
        //this.panel_height = this.height;

        this.element.appendChild(this.canvas); //добавление контекста в передаваемый элемент
    }

    place_game_over({score})
    {
        this.clear_field();
        this.ctx.fillStyle = 'black'; //цвет текста
        this.ctx.font = '14px "Crimson+Pro"';
        this.ctx.textAlign = 'center'; //по центру
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('GAME OVER', this.width/2+75, this.height/2 - 48);
        this.ctx.fillText(`Score: ${score}`, this.width/2+75, this.height/2);
        this.ctx.fillText("Press ENTER to restart", this.width/2+75, this.height/2 + 48);

        this.ctx.fillText(`Top scores:`, this.width/2+75, this.height/2 + 48+24);

        this.ctx.textAlign = 'left';
        this.ctx.textBaseLine = 'bottom';
        let best_scores = this.place_top_scores();
        for (let i = 0; i < best_scores.length; i++)
        {
            this.ctx.fillText(`${i+1}) ${best_scores[i]}`, this.width/2-20+75, this.height/2 +48+24*(2+i));
        }
    }

    place_top_scores()
    {
        let best_scores = JSON.parse(localStorage.getItem("best_scores"));

        if (best_scores === null || best_scores === undefined)
        {
            best_scores = [0, 0, 0, 0, 0];
        }

        return best_scores;
    }

    place_panel({next_figure_move, score, level})
    {
        let colors =
            {
                '1' : 'red',
                '2' : 'green',
                '3' : 'blue',
                '4' : 'pink',
                '5' : 'yellow',
                '6' : 'purple',
                '7' : 'orange'
            };

        const col_2 =
            {
                '1' : 'HotPink',
                '2' : 'Crimson',
                '3' : 'DarkBlue',
                '4' : 'DarkOrange',
                '5' : 'DeepPink'
            }

        this.ctx.textAlign = 'left'; // справа
        this.ctx.textBaseline = 'top'; // по верхнему краю
        this.ctx.fillStyle = 'black'; //цвет текста
        this.ctx.font = '14px "Crimson+Pro"'; //шрифт
        //this.ctx.fillStyle = 'red';
        this.ctx.fillText(`Level: ${level}`, this.panel_x, this.panel_y);
        this.ctx.fillText(`Score: ${score}`, this.panel_x, this.panel_y + 24);

        let name = localStorage.getItem('#tetris.name_input');
        this.ctx.fillText(`Your name: ${name}`, this.panel_x, this.panel_y + 48);

        //let scores = localStorage.getItem('best_scores');

        //this.place_top_scores(this.panel_x, this.panel_y + 72);
        let best_scores = this.place_top_scores();


        this.ctx.fillText(`Top scores:`, this.panel_x, this.panel_y + 48+24);
        for (let i = 0; i < best_scores.length; i++)
        {
            this.ctx.fillStyle = col_2[Math.floor(Math.random() * 5)];
            this.ctx.fillText(`${i+1}) ${best_scores[i]}`, this.panel_x, this.panel_y + 48+24*(2+i));
        }

        //this.ctx.fillText(`Top scores: ${JSON.parse(localStorage.getItem("best_scores"))}`,
            //this.panel_x, this.panel_y + 48 + 24);

        this.ctx.fillText("Next figure:", this.panel_x, this.panel_y + 48 + 24*7);


        for (let y = 0; y < next_figure_move.blocks.length; y++) //следующая фигура
        {
            for (let x = 0; x < next_figure_move.blocks[y].length; x++)
            {
                if (next_figure_move.blocks[y][x] !== 0)
                {
                    this.place_cell(x*this.cell_width/2 + this.panel_x, y*this.cell_height/2 + this.panel_y + 225,
                        this.cell_width/2, this.cell_height/2, colors[next_figure_move.blocks[y][x]]);
                }
            }
        }

        this.ctx.fillText("Control:", this.panel_x, this.panel_y + 300);
        this.ctx.fillText("Left arrow - Left move", this.panel_x, this.panel_y + 324);
        this.ctx.fillText("Right arrow - Right move", this.panel_x, this.panel_y + 348);
        this.ctx.fillText("Hold Down arrow - Falling down", this.panel_x, this.panel_y + 372);
        this.ctx.fillText("\'Shift\' - Сounterclockwise rotation", this.panel_x, this.panel_y + 396);
        this.ctx.fillText("Up arrow - Clockwise rotation", this.panel_x, this.panel_y + 420);

    }

    update_field(condition)
    {
        this.clear_field();
        this.place_field(condition);
        this.place_panel(condition);
    }

    clear_field()
    {
        this.ctx.clearRect(0,0, this.width, this.height);
    }

    place_cell(x, y, width, height, color)
    {
        //console.log({y, x});
        this.ctx.fillStyle = color; //заливка
        this.ctx.strokeStyle = 'black'; //обводка
        this.ctx.lineWidth = 2; //ширина обводки
        this.ctx.fillRect(x, y, width, height);
        this.ctx.strokeRect(x, y, width, height); // обводка
        //размещение фигуры (поклеточно в пикселях с шириной одной клетки на поле)
    }

    place_field({field})
    {
        let colors =
        {
            '1' : 'red',
            '2' : 'green',
            '3' : 'blue',
            '4' : 'pink',
            '5' : 'yellow',
            '6' : 'purple',
            '7' : 'orange'
        };
        //console.log(field);
        for (let y = 0; y < field.length; y++)
        {
            for (let x = 0; x < field[y].length; x++)
            {
                if (field[y][x] !== 0)
                {
                    this.place_cell(x*this.cell_width + this.field_x, y*this.cell_height + this.field_y,
                        this.cell_width, this.cell_height, colors[field[y][x]])
                }
            }
        }

        this.ctx.strokeStyle = "black"; //обводка
        this.ctx.lineWidth = this.field_border_width;
        this.ctx.strokeRect(this.field_border_width, this.field_border_width,
            this.field_width-this.field_border_width-1, this.field_height-this.field_border_width);
    }
}